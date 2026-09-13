import prisma from "../prisma.js";

export const getQuizzes = async (req, res) => {
  try {
    const { trackId, isBaseline } = req.query;
    const where = { isPublished: true };

    if (trackId) where.trackId = trackId;
    if (isBaseline !== undefined) where.isBaseline = isBaseline === "true";

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        track: true,
        skill: true,
        _count: { select: { questions: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes." });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        track: true,
        skill: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            difficulty: true
            // omit correctAnswer and explanation until submission
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz." });
  }
};

export const getBaselineQuizByTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        trackId,
        isBaseline: true,
        isPublished: true
      },
      include: {
        track: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            difficulty: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "No baseline quiz available for this track." });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch baseline quiz." });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // quizId
    const { answers } = req.body; // array of { questionId, selectedOption }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        skill: true,
        track: true,
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    const questionMap = new Map();
    quiz.questions.forEach(q => questionMap.set(q.id, q));

    let score = 0;
    const evaluatedAnswers = [];

    (answers || []).forEach(sub => {
      const q = questionMap.get(sub.questionId);
      if (q) {
        const isCorrect = q.correctAnswer.toUpperCase() === (sub.selectedOption || "").toUpperCase();
        if (isCorrect) score++;

        evaluatedAnswers.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedOption: sub.selectedOption,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation
        });
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= 60;

    // 1. Create QuizAttempt record in DB
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: id,
        score,
        totalQuestions,
        percentage,
        passed,
        completedAt: new Date()
      }
    });

    // 2. Save individual QuizAnswer records
    for (const ans of evaluatedAnswers) {
      await prisma.quizAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: ans.questionId,
          selectedOption: ans.selectedOption || "",
          isCorrect: ans.isCorrect
        }
      });
    }

    // 3. Update Learner's Skill Profile in DB (Progress Update)
    let skillUpdateMessage = "";
    const updatedSkills = [];

    // If quiz has an explicit skillId:
    if (quiz.skillId) {
      const existing = await prisma.userSkillLevel.findUnique({
        where: { userId_skillId: { userId, skillId: quiz.skillId } }
      });

      const currentLevel = existing ? existing.currentLevel : 1;
      let newLevel = currentLevel;

      if (percentage >= 80) {
        newLevel = Math.min(5, currentLevel + 1);
        skillUpdateMessage = `Excellent score (${percentage}%)! Your ${quiz.skill.name} level bumped to Level ${newLevel}/5.`;
      } else if (percentage >= 60) {
        newLevel = Math.min(5, currentLevel);
        skillUpdateMessage = `Good effort (${percentage}%)! Competency confirmed at Level ${newLevel}/5.`;
      } else {
        skillUpdateMessage = `Score below benchmark (${percentage}%). ${quiz.skill.name} flagged as a priority learning gap.`;
      }

      await prisma.userSkillLevel.upsert({
        where: { userId_skillId: { userId, skillId: quiz.skillId } },
        create: {
          userId,
          skillId: quiz.skillId,
          currentLevel: newLevel,
          source: "QUIZ",
          lastAssessedAt: new Date()
        },
        update: {
          currentLevel: newLevel,
          source: "QUIZ",
          lastAssessedAt: new Date()
        }
      });

      updatedSkills.push({
        skillName: quiz.skill.name,
        oldLevel: currentLevel,
        newLevel
      });
    } else if (quiz.isBaseline && quiz.trackId) {
      // Baseline assessment: set baseline scores across framework
      const framework = await prisma.competencyFramework.findMany({
        where: { trackId: quiz.trackId },
        include: { skill: true }
      });

      const baselineScoreLevel = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

      for (const fw of framework) {
        await prisma.userSkillLevel.upsert({
          where: { userId_skillId: { userId, skillId: fw.skillId } },
          create: {
            userId,
            skillId: fw.skillId,
            currentLevel: baselineScoreLevel,
            source: "BASELINE",
            lastAssessedAt: new Date()
          },
          update: {
            currentLevel: baselineScoreLevel,
            source: "BASELINE",
            lastAssessedAt: new Date()
          }
        });
      }
      skillUpdateMessage = `Baseline established at Level ${baselineScoreLevel}/5 based on ${percentage}% assessment score.`;
    }

    res.json({
      message: passed ? "Quiz completed successfully!" : "Quiz completed. Keep practicing!",
      attempt: {
        id: attempt.id,
        score,
        totalQuestions,
        percentage,
        passed
      },
      skillUpdateMessage,
      updatedSkills,
      evaluatedAnswers
    });
  } catch (error) {
    console.error("submitQuizAttempt error:", error);
    res.status(500).json({ error: "Failed to evaluate quiz attempt." });
  }
};

export const getMyQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: { track: true, skill: true }
        }
      },
      orderBy: { startedAt: "desc" }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz history." });
  }
};
