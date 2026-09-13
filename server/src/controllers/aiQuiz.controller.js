import path from "path";
import prisma from "../prisma.js";
import { extractTextFromFile } from "../services/document.service.js";
import { generateQuizFromText } from "../services/ai.service.js";

export const uploadAndGenerateQuiz = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a valid PDF, text, or presentation file." });
    }

    const { trackId, skillId, title, questionCount = 5 } = req.body;
    const userId = req.user.id;
    const file = req.file;

    // Stage 1: Uploading complete
    // Stage 2: Extracting text
    const { text: extractedText, wordCount } = await extractTextFromFile(file.path, file.mimetype, file.originalname);

    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({ error: "The uploaded file contains insufficient readable text." });
    }

    // Save UploadedContent in DB
    const uploadedRecord = await prisma.uploadedContent.create({
      data: {
        userId,
        title: title || file.originalname,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        filePath: file.path,
        extractedText: extractedText.slice(0, 50000), // persist up to 50k chars
        wordCount,
        status: "PROCESSED"
      }
    });

    // Stage 3: Generating questions via AI layer
    let trackName = "Computer Science";
    if (trackId) {
      const track = await prisma.track.findUnique({ where: { id: trackId } });
      if (track) trackName = track.name;
    }

    const generatedQuestions = await generateQuizFromText(
      extractedText,
      parseInt(questionCount) || 5,
      trackName
    );

    // Stage 4: Saving draft quiz to DB (isPublished: false for review)
    const quizTitle = title || `AI Quiz: ${path.parse(file.originalname).name}`;
    const quiz = await prisma.quiz.create({
      data: {
        title: quizTitle,
        description: `Automated assessment derived from "${file.originalname}" (${wordCount} words analyzed).`,
        trackId: trackId || null,
        skillId: skillId || null,
        uploadedContentId: uploadedRecord.id,
        createdById: userId,
        isPublished: false, // requires review before publication
        timeLimitMinutes: Math.max(5, generatedQuestions.length * 2)
      }
    });

    // Create question records
    const savedQuestions = [];
    for (const q of generatedQuestions) {
      const createdQ = await prisma.question.create({
        data: {
          quizId: quiz.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty || "MEDIUM",
          sourceTag: q.sourceTag || "AI Extracted"
        }
      });
      savedQuestions.push(createdQ);
    }

    res.json({
      message: "AI Quiz generated successfully and queued for review.",
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        isPublished: quiz.isPublished,
        wordCount,
        stages: [
          { name: "Upload Document", status: "completed" },
          { name: "Extract Text Content", status: "completed", detail: `${wordCount} words extracted` },
          { name: "AI Question Generation", status: "completed", detail: `${savedQuestions.length} MCQs synthesized` },
          { name: "Save to Database", status: "completed" }
        ]
      },
      questions: savedQuestions
    });
  } catch (error) {
    console.error("uploadAndGenerateQuiz error:", error);
    res.status(500).json({ error: `Quiz generation failed: ${error.message}` });
  }
};

export const updateGeneratedQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty } = req.body;

    const updated = await prisma.question.update({
      where: { id },
      data: {
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        difficulty
      }
    });

    res.json({
      message: "Question updated successfully.",
      question: updated
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update question." });
  }
};

export const deleteGeneratedQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({ where: { id } });
    res.json({ message: "Question discarded." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question." });
  }
};

export const publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isPublished = true } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        isPublished: Boolean(isPublished),
        ...(title ? { title } : {})
      },
      include: {
        questions: true,
        track: true
      }
    });

    res.json({
      message: `Quiz "${quiz.title}" is now published and live for learners!`,
      quiz
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to publish quiz." });
  }
};

export const getReviewQueue = async (req, res) => {
  try {
    const drafts = await prisma.quiz.findMany({
      where: { isPublished: false },
      include: {
        track: true,
        skill: true,
        questions: true,
        uploadedContent: true,
        createdBy: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(drafts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch review queue." });
  }
};
