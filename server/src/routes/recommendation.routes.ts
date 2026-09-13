import { Router } from "express";
import { getMyLearningPath } from "../controllers/recommendation.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my-path", authenticate, getMyLearningPath);

export default router;
