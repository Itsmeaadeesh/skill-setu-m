import { Router } from "express";
import { getAllCourses, getCourseById, enrollCourse, updateCourseProgress, completeCourse } from "../controllers/courses.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Optional auth for browse, required for actions
router.get("/", (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authenticate(req, res, next);
  }
  next();
}, getAllCourses);

router.get("/:id", (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authenticate(req, res, next);
  }
  next();
}, getCourseById);

router.post("/enroll", authenticate, enrollCourse);
router.put("/:id/progress", authenticate, updateCourseProgress);
router.post("/:id/complete", authenticate, completeCourse);

export default router;
