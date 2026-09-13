import { Router } from "express";
import { getMySkillGaps } from "../controllers/gapAnalysis.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my-gaps", authenticate, getMySkillGaps);

export default router;
