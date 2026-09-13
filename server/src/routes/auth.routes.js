import { Router } from "express";
import { register, login, getMe, completeOnboarding, switchDemoAccount, listDemoAccounts } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/onboard", authenticate, completeOnboarding);
router.post("/switch-demo", switchDemoAccount);
router.get("/demo-accounts", listDemoAccounts);

export default router;
