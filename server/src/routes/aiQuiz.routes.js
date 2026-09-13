import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadAndGenerateQuiz, updateGeneratedQuestion, deleteGeneratedQuestion, publishQuiz, getReviewQueue } from "../controllers/aiQuiz.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

router.post("/upload", authenticate, upload.single("file"), uploadAndGenerateQuiz);
router.put("/questions/:id", authenticate, updateGeneratedQuestion);
router.delete("/questions/:id", authenticate, deleteGeneratedQuestion);
router.post("/publish/:id", authenticate, publishQuiz);
router.get("/review-queue", authenticate, getReviewQueue);

export default router;
