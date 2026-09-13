import { Router } from "express";
import { getRecommendedLearningPath } from "../controllers/recommendations.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getRecommendedLearningPath);

export default router;
