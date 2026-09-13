import { Router } from "express";
import { submitSelfRatings, getMySkillProfiles } from "../controllers/assessment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/self-rate", authenticate, submitSelfRatings);
router.get("/my-profile", authenticate, getMySkillProfiles);

export default router;
