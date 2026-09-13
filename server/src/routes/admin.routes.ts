import { Router } from "express";
import { getAdminAnalytics } from "../controllers/admin.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Only admin users can access the administrative aggregation endpoints
router.get("/analytics", authenticate, requireRole("admin"), getAdminAnalytics);

export default router;
