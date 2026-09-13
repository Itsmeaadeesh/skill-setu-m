import prisma from "../prisma.js";
import { SkillGapItem } from "../types/index.js";

export interface GapAnalysisResult {
  track: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  gaps: SkillGapItem[];
  unmetGaps: SkillGapItem[];
  readinessPercentage: number;
  totalSkills: number;
  skillsMastered: number;
}

/**
 * Compares learner's SkillProfile against TrackRequirement models.
 * Returns ranked list of gaps (requiredLevel - currentLevel descending),
 * tagged as foundational / intermediate / advanced.
 */
export async function calculateUserSkillGaps(
  userId: string,
  targetTrackId?: string | null
): Promise<GapAnalysisResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skillProfiles: {
        include: { skill: true }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const trackId = targetTrackId || user.targetTrackId;
  let track = null;

  if (trackId) {
    track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        requirements: {
          include: { skill: true }
        }
      }
    });
  }

  // Fallback to first track if user hasn't selected one
  if (!track) {
    track = await prisma.track.findFirst({
      include: {
        requirements: {
          include: { skill: true }
        }
      }
    });
  }

  if (!track) {
    throw new Error("No learning tracks found in system.");
  }

  const profileMap = new Map<string, { level: number; source: string }>();
  user.skillProfiles.forEach((sp) => {
    profileMap.set(sp.skillId, { level: sp.level, source: sp.source });
  });

  const gapItems: SkillGapItem[] = track.requirements.map((req) => {
    const profile = profileMap.get(req.skillId);
    const currentLevel = profile ? profile.level : 1;
    const source = profile ? profile.source : "unassessed";
    const requiredLevel = req.requiredLevel;
    const gap = Math.max(0, requiredLevel - currentLevel);

    let tag: "foundational" | "intermediate" | "advanced";
    if (currentLevel <= 2) {
      tag = "foundational";
    } else if (currentLevel === 3) {
      tag = "intermediate";
    } else {
      tag = "advanced";
    }

    return {
      skillId: req.skillId,
      skillName: req.skill.name,
      category: req.skill.category,
      icon: req.skill.icon,
      currentLevel,
      requiredLevel,
      gap,
      tag,
      source,
      isMet: currentLevel >= requiredLevel
    };
  });

  // Rank by gap (descending) so highest deficiencies appear first
  gapItems.sort((a, b) => b.gap - a.gap || a.currentLevel - b.currentLevel);

  const totalSkills = gapItems.length;
  const skillsMastered = gapItems.filter((g) => g.isMet).length;
  const unmetGaps = gapItems.filter((g) => !g.isMet);

  // Compute overall percentage readiness toward target track
  const totalRequiredPoints = gapItems.reduce((acc, g) => acc + g.requiredLevel, 0);
  const totalAcquiredPoints = gapItems.reduce((acc, g) => acc + Math.min(g.currentLevel, g.requiredLevel), 0);
  const readinessPercentage =
    totalRequiredPoints > 0 ? Math.round((totalAcquiredPoints / totalRequiredPoints) * 100) : 0;

  return {
    track: {
      id: track.id,
      name: track.name,
      description: track.description,
      icon: track.icon
    },
    gaps: gapItems,
    unmetGaps,
    readinessPercentage,
    totalSkills,
    skillsMastered
  };
}
