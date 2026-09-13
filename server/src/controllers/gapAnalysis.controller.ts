import { Response } from "express";
import { AuthRequest } from "../types/index.js";
import { calculateUserSkillGaps } from "../services/gapAnalysis.service.js";

export async function getMyGaps(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { trackId } = req.query;
    const result = await calculateUserSkillGaps(
      req.user.id,
      typeof trackId === "string" ? trackId : undefined
    );

    res.json(result);
  } catch (err: any) {
    console.error("Gap analysis error:", err);
    res.status(500).json({ error: "Failed to compute skill gaps", details: err.message });
  }
}
