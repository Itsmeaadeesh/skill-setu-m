import { Router } from "express";
import { getMyGaps } from "../controllers/gapAnalysis.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my-gaps", authenticate, getMyGaps);

export default router;
