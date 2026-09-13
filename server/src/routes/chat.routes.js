import { Router } from "express";
import { sendMessage, getChatHistory } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/message", authenticate, sendMessage);
router.get("/history", authenticate, getChatHistory);

export default router;
