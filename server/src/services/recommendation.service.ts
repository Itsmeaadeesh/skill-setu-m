import prisma from "../prisma.js";
import { calculateUserSkillGaps } from "./gapAnalysis.service.js";
import { CoursePathItem } from "../types/index.js";

const DIFFICULTY_WEIGHT: Record<string, number> = {
  foundational: 1,
  intermediate: 2,
  advanced: 3
};

export interface LearningPathResult {
  trackName: string;
  totalSteps: number;
  estimatedHours: number;
  path: CoursePathItem[];
  unmetSkillsCovered: string[];
}

/**
 * Builds a linear, foundational-first learning path tailored to the learner's skill gaps.
 */
export async function generateLearningPath(
  userId: string,
  targetTrackId?: string | null
): Promise<LearningPathResult> {
  const gapAnalysis = await calculateUserSkillGaps(userId, targetTrackId);
  const gapSkills = gapAnalysis.unmetGaps.length > 0 ? gapAnalysis.unmetGaps : gapAnalysis.gaps;

  const skillIds = gapSkills.map((g) => g.skillId);

  // Fetch all available courses mapped to these gap skills
  const availableCourses = await prisma.course.findMany({
    where: {
      skillId: { in: skillIds }
    },
    include: {
      skill: true
    }
  });

  // Group courses by skill and order foundational-first
  const prioritizedCourses = [...availableCourses].sort((a, b) => {
    // 1. Foundational first, then intermediate, then advanced
    const weightA = DIFFICULTY_WEIGHT[a.difficulty.toLowerCase()] || 2;
    const weightB = DIFFICULTY_WEIGHT[b.difficulty.toLowerCase()] || 2;
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    // 2. High rating preference
    return b.rating - a.rating;
  });

  // Pick up to 1-2 curated courses per skill gap to maintain a concise, non-overwhelming linear roadmap
  const selectedCourseIds = new Set<string>();
  const skillCourseCount: Record<string, number> = {};
  const linearPath: CoursePathItem[] = [];

  for (const course of prioritizedCourses) {
    const currentCount = skillCourseCount[course.skillId] || 0;
    if (currentCount < 2 && !selectedCourseIds.has(course.id)) {
      selectedCourseIds.add(course.id);
      skillCourseCount[course.skillId] = currentCount + 1;
      linearPath.push({
        id: course.id,
        title: course.title,
        description: course.description,
        skillId: course.skillId,
        skillName: course.skill.name,
        difficulty: (course.difficulty as "foundational" | "intermediate" | "advanced") || "foundational",
        durationHours: course.durationHours,
        provider: course.provider,
        rating: course.rating,
        stepNumber: linearPath.length + 1
      });
    }
  }

  // Re-number steps 1..N
  linearPath.forEach((item, idx) => {
    item.stepNumber = idx + 1;
  });

  const estimatedHours = linearPath.reduce((acc, c) => acc + c.durationHours, 0);
  const unmetSkillsCovered = Array.from(new Set(linearPath.map((c) => c.skillName)));

  return {
    trackName: gapAnalysis.track.name,
    totalSteps: linearPath.length,
    estimatedHours,
    path: linearPath,
    unmetSkillsCovered
  };
}
