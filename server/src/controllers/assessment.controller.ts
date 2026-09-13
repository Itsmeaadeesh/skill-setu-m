import { Response } from "express";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";
import { calculateUserSkillGaps } from "../services/gapAnalysis.service.js";

export async function submitSelfRatings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { ratings } = req.body as { ratings: Array<{ skillId: string; level: number }> };

    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      res.status(400).json({ error: "Ratings array is required." });
      return;
    }

    // Upsert each skill rating in SkillProfile
    const updatedProfiles = [];
    for (const item of ratings) {
      const clampedLevel = Math.max(1, Math.min(5, Math.round(item.level)));
      const profile = await prisma.skillProfile.upsert({
        where: {
          userId_skillId: {
            userId: req.user.id,
            skillId: item.skillId
          }
        },
        update: {
          level: clampedLevel,
          source: "self-rated",
          lastAssessedAt: new Date()
        },
        create: {
          userId: req.user.id,
          skillId: item.skillId,
          level: clampedLevel,
          source: "self-rated"
        },
        include: { skill: true }
      });
      updatedProfiles.push(profile);
    }

    // Recompute gaps dynamically
    const freshGaps = await calculateUserSkillGaps(req.user.id);

    res.json({
      message: "Skill profile updated successfully via self-assessment.",
      updatedProfiles,
      freshGaps
    });
  } catch (err: any) {
    console.error("Failed to submit self-ratings:", err);
    res.status(500).json({ error: "Failed to update skill profile", details: err.message });
  }
}

export async function getMySkillProfiles(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profiles = await prisma.skillProfile.findMany({
      where: { userId: req.user.id },
      include: { skill: true },
      orderBy: { updatedAt: "desc" }
    });

    res.json(profiles);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch skill profiles", details: err.message });
  }
}
