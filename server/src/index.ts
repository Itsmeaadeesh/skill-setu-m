import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from "./routes/auth.routes.js";
import tracksRoutes from "./routes/tracks.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import gapAnalysisRoutes from "./routes/gapAnalysis.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import prisma from "./prisma.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://localhost:3000", "*"],
    credentials: true
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file serving for uploads
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Health Check
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "healthy",
      service: "Skill Setu Backend API",
      timestamp: new Date().toISOString(),
      database: "connected",
      aiProvider: process.env.GEMINI_API_KEY ? "Google Gemini (Active)" : "Smart Contextual Heuristic (Demo Mode)"
    });
  } catch (dbErr: any) {
    res.status(500).json({
      status: "degraded",
      database: "disconnected",
      error: dbErr.message
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/gap-analysis", gapAnalysisRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error occurred",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Skill Setu Backend listening at http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
