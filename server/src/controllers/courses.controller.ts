import { Request, Response } from "express";
import prisma from "../prisma.js";

export async function listCourses(req: Request, res: Response): Promise<void> {
  try {
    const { skillId, trackId, difficulty } = req.query;

    const where: any = {};
    if (skillId) where.skillId = String(skillId);
    if (trackId) where.trackId = String(trackId);
    if (difficulty) where.difficulty = String(difficulty);

    const courses = await prisma.course.findMany({
      where,
      include: {
        skill: true,
        track: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list courses", details: err.message });
  }
}

export async function getCourseById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        skill: true,
        track: true
      }
    });

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(course);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch course details", details: err.message });
  }
}
