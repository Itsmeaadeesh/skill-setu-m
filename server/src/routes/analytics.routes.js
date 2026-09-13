import { Router } from "express";
import { getAdminAnalytics, exportAnalyticsCSV } from "../controllers/analytics.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/admin", authenticate, getAdminAnalytics);
router.get("/export-csv", authenticate, exportAnalyticsCSV);

export default router;
