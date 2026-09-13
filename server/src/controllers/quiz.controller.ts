import { Request, Response } from "express";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";
import { extractTextFromFile } from "../services/document.service.js";
import { generateQuizFromText } from "../services/ai.service.js";
import { calculateUserSkillGaps } from "../services/gapAnalysis.service.js";
import { generateLearningPath } from "../services/recommendation.service.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("[PROJECT-REF]")) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Supabase client init failed in quiz controller:", e);
  }
}

/**
 * Upload study material (PDF/PPT/DOCX), run OCR if needed, call Gemini API,
 * validate JSON, and store Quiz + QuizQuestions.
 */
export async function generateQuizFromUpload(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No document file uploaded." });
      return;
    }

    const { skillId, trackId, title, numQuestions = 5 } = req.body;
    const file = req.file;

    // 1. Resolve Skill & Track
    let skill = null;
    if (skillId) {
      skill = await prisma.skill.findUnique({ where: { id: skillId } });
    }
    if (!skill) {
      skill = await prisma.skill.findFirst();
    }
    const skillName = skill ? skill.name : "Core Competencies";

    let track = null;
    if (trackId) {
      track = await prisma.track.findUnique({ where: { id: trackId } });
    }

    // 2. Upload to Supabase Storage if configured, or record local path
    let fileStorageUrl = `/uploads/${file.filename}`;
    if (supabase) {
      try {
        const fileBuffer = await fs.readFile(file.path);
        const cleanName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { data: storageData, error: storageErr } = await supabase.storage
          .from("documents")
          .upload(cleanName, fileBuffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (!storageErr && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from("documents")
            .getPublicUrl(cleanName);
          fileStorageUrl = publicUrlData.publicUrl;
        }
      } catch (storageException: any) {
        console.warn("Supabase Storage upload fallback to local storage:", storageException.message);
      }
    }

    // 3. Extract text from document (runs Tesseract OCR if scanned PDF)
    const { text, isScannedPdf } = await extractTextFromFile(
      file.path,
      file.mimetype,
      file.originalname
    );

    // 4. Generate MCQs using Google Gemini API with strict JSON validation and retry
    const questionsCount = Math.max(3, Math.min(10, Number(numQuestions) || 5));
    const generatedMCQs = await generateQuizFromText(
      text,
      skillName,
      track?.name || "Technical Track",
      questionsCount
    );

    // 5. Persist Quiz and Questions in Prisma
    const quizTitle =
      title || `${skillName} AI Assessment: ${file.originalname.replace(/\.[^/.]+$/, "")}`;

    const quiz = await prisma.quiz.create({
      data: {
        title: quizTitle,
        description: `AI-generated assessment derived from ${file.originalname}${
          isScannedPdf ? " (analyzed via Tesseract OCR)" : ""
        }.`,
        skillId: skill?.id || null,
        trackId: track?.id || null,
        sourceFileUrl: fileStorageUrl,
        sourceFilename: file.originalname,
        sourceText: text.slice(0, 3000),
        isBaseline: false,
        createdById: req.user?.id || null,
        timeLimitMinutes: Math.max(5, questionsCount * 2)
      }
    });

    // Create QuizQuestions
    for (const q of generatedMCQs) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: q.question,
          options: JSON.stringify(q.options),
          correct_option: q.correct_option,
          explanation: q.explanation,
          difficulty: q.difficulty || "intermediate"
        }
      });
    }

    // Retrieve populated quiz
    const fullQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        skill: true,
        track: true,
        questions: true
      }
    });

    res.status(201).json({
      message: "AI Quiz generated successfully!",
      isScannedPdf,
      quiz: fullQuiz
    });
  } catch (err: any) {
    console.error("AI Quiz generation error:", err);
    res.status(500).json({
      error: err.message || "Failed to generate AI quiz from document.",
      details: err.stack
    });
  }
}

export async function listQuizzes(req: Request, res: Response): Promise<void> {
  try {
    const { trackId, skillId, isBaseline } = req.query;

    const where: any = {};
    if (trackId) where.trackId = String(trackId);
    if (skillId) where.skillId = String(skillId);
    if (isBaseline !== undefined) where.isBaseline = isBaseline === "true";

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        skill: true,
        track: true,
        _count: {
          select: { questions: true, attempts: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list quizzes", details: err.message });
  }
}

export async function getQuizById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { mode } = req.query; // "take" or "review"

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        skill: true,
        track: true,
        questions: true
      }
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    // Parse question options
    const parsedQuestions = quiz.questions.map((q) => {
      let optionsArray: string[] = [];
      try {
        optionsArray = JSON.parse(q.options);
      } catch (e) {
        optionsArray = [q.options];
      }

      if (mode === "take") {
        // Hide answer keys during examination
        return {
          id: q.id,
          question: q.question,
          options: optionsArray,
          difficulty: q.difficulty
        };
      }

      return {
        id: q.id,
        question: q.question,
        options: optionsArray,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty
      };
    });

    res.json({
      ...quiz,
      questions: parsedQuestions
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch quiz details", details: err.message });
  }
}

/**
 * Instant scoring of submitted quiz answers, persists QuizAttempt,
 * and recalculates SkillProfile proficiency level.
 */
export async function submitQuizAttempt(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const quizId = String(req.params.id);
    const { answers } = req.body as { answers: Record<string, number> };

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        skill: true
      }
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found." });
      return;
    }

    // Instant grading
    let rawScore = 0;
    const totalQuestions = quiz.questions.length;
    const reviewBreakdown = [];

    for (const q of quiz.questions) {
      let optionsArray: string[] = [];
      try {
        optionsArray = JSON.parse(q.options);
      } catch (e) {
        optionsArray = [];
      }

      const selectedOption = answers ? answers[q.id] : undefined;
      const isCorrect = selectedOption === q.correct_option;

      if (isCorrect) {
        rawScore++;
      }

      reviewBreakdown.push({
        questionId: q.id,
        question: q.question,
        options: optionsArray,
        selectedOption: selectedOption !== undefined ? selectedOption : null,
        correctOption: q.correct_option,
        isCorrect,
        explanation: q.explanation,
        difficulty: q.difficulty
      });
    }

    const percentage = totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * 100) : 0;
    const passed = percentage >= 60;

    // 1. Store QuizAttempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: quiz.id,
        score: rawScore,
        totalQuestions,
        percentage,
        passed,
        answersJson: JSON.stringify(reviewBreakdown)
      }
    });

    // 2. Update Learner's SkillProfile Level for the tested skill
    let updatedSkillLevel = null;
    if (quiz.skillId) {
      let derivedLevel = 1;
      if (percentage >= 85) derivedLevel = 5;
      else if (percentage >= 70) derivedLevel = 4;
      else if (percentage >= 55) derivedLevel = 3;
      else if (percentage >= 40) derivedLevel = 2;
      else derivedLevel = 1;

      // Upsert skill profile
      const updatedProfile = await prisma.skillProfile.upsert({
        where: {
          userId_skillId: {
            userId: req.user.id,
            skillId: quiz.skillId
          }
        },
        update: {
          // Advance level if higher or update with quiz source
          level: derivedLevel,
          source: "quiz",
          lastAssessedAt: new Date()
        },
        create: {
          userId: req.user.id,
          skillId: quiz.skillId,
          level: derivedLevel,
          source: "quiz"
        },
        include: { skill: true }
      });

      updatedSkillLevel = updatedProfile;
    }

    // 3. Dynamic Progress Recalculation (Gaps + Recommendations)
    const freshGaps = await calculateUserSkillGaps(req.user.id);
    const freshPath = await generateLearningPath(req.user.id);

    res.json({
      message: passed ? "Assessment Passed!" : "Assessment Completed",
      attemptId: attempt.id,
      score: rawScore,
      totalQuestions,
      percentage,
      passed,
      questionsReview: reviewBreakdown,
      updatedSkillLevel,
      freshGaps,
      freshPath
    });
  } catch (err: any) {
    console.error("Quiz submission scoring error:", err);
    res.status(500).json({ error: "Failed to score quiz submission", details: err.message });
  }
}

export async function getMyAttempts(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.user.id },
      include: {
        quiz: {
          include: { skill: true, track: true }
        }
      },
      orderBy: { timestamp: "desc" }
    });

    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch quiz attempts", details: err.message });
  }
}

export async function deleteQuiz(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.quiz.delete({ where: { id } });
    res.json({ message: "Quiz deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete quiz", details: err.message });
  }
}
