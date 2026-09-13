import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from "./routes/auth.routes.js";
import tracksRoutes from "./routes/tracks.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import gapAnalysisRoutes from "./routes/gapAnalysis.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import aiQuizRoutes from "./routes/aiQuiz.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static file hosting for uploads
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Skill Setu Backend API",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/gap-analysis", gapAnalysisRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai-quiz", aiQuizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found.` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({
    error: err.message || "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  Skill Setu API Server running on port ${PORT}`);
  console.log(`  Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
