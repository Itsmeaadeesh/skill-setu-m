import { Response } from "express";
import { AuthRequest } from "../types/index.js";
import { generateLearningPath } from "../services/recommendation.service.js";

export async function getMyLearningPath(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { trackId } = req.query;
    const result = await generateLearningPath(
      req.user.id,
      typeof trackId === "string" ? trackId : undefined
    );

    res.json(result);
  } catch (err: any) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Failed to generate recommended learning path", details: err.message });
  }
}
