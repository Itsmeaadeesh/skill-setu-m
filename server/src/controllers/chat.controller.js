import prisma from "../prisma.js";
import { generateChatResponse } from "../services/ai.service.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message text is required." });
    }

    // 1. Gather learner context from real DB tables
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        track: true,
        skillLevels: { include: { skill: true } },
        enrollments: { include: { course: true } },
        quizAttempts: {
          take: 5,
          orderBy: { completedAt: "desc" },
          include: { quiz: true }
        }
      }
    });

    let topGaps = [];
    if (user.trackId) {
      const framework = await prisma.competencyFramework.findMany({
        where: { trackId: user.trackId },
        include: { skill: true }
      });

      const skillMap = new Map();
      user.skillLevels.forEach(s => skillMap.set(s.skillId, s.currentLevel));

      framework.forEach(fw => {
        const currentLevel = skillMap.get(fw.skillId) || 0;
        const gap = Math.max(0, fw.requiredLevel - currentLevel);
        if (gap > 0) {
          topGaps.push({
            skillName: fw.skill.name,
            currentLevel,
            requiredLevel: fw.requiredLevel,
            gap,
            priority: fw.priority
          });
        }
      });
      topGaps.sort((a, b) => b.gap - a.gap);
    }

    const context = {
      userName: user.name,
      trackName: user.track ? user.track.name : "General",
      currentSkills: user.skillLevels.map(s => `${s.skill.name}: Level ${s.currentLevel}`),
      topGaps: topGaps.slice(0, 4),
      enrolledCourses: user.enrollments.map(e => e.course.title),
      recentScores: user.quizAttempts.map(a => ({ quizTitle: a.quiz.title, score: a.percentage }))
    };

    // 2. Save user message to DB
    await prisma.chatMessage.create({
      data: {
        userId,
        sender: "user",
        message: message.trim()
      }
    });

    // 3. Generate grounded AI response
    const assistantReply = await generateChatResponse(message, context);

    // 4. Save assistant reply to DB
    const savedReply = await prisma.chatMessage.create({
      data: {
        userId,
        sender: "assistant",
        message: assistantReply
      }
    });

    res.json({
      reply: assistantReply,
      timestamp: savedReply.createdAt
    });
  } catch (error) {
    console.error("Chat sendMessage error:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 50
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
};
