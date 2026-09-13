import { Router } from "express";
import { getAllSkills, getUserSkillLevels, updateSkillLevel, submitSelfRatingAssessment } from "../controllers/skills.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllSkills);
router.get("/my-levels", authenticate, getUserSkillLevels);
router.post("/update-level", authenticate, updateSkillLevel);
router.post("/self-rate", authenticate, submitSelfRatingAssessment);

export default router;
