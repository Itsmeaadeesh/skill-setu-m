import { Router } from "express";
import { getQuizzes, getQuizById, getBaselineQuizByTrack, submitQuizAttempt, getMyQuizHistory } from "../controllers/quiz.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getQuizzes);
router.get("/baseline/:trackId", getBaselineQuizByTrack);
router.get("/history/my", authenticate, getMyQuizHistory);
router.get("/:id", getQuizById);
router.post("/:id/submit", authenticate, submitQuizAttempt);

export default router;
