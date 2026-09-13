import { Response } from "express";
import prisma from "../prisma.js";
import { AuthRequest } from "../types/index.js";

export async function getAdminAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    // 1. KPI Counts
    const [totalLearners, totalTracks, totalQuizzes, totalAttempts, attemptsAgg] = await Promise.all([
      prisma.user.count({ where: { role: "learner" } }),
      prisma.track.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.aggregate({
        _avg: { percentage: true }
      })
    ]);

    const averagePlatformScore = Math.round(attemptsAgg._avg.percentage || 0);

    // 2. Most Common Skill Gaps across all learners
    const requirements = await prisma.trackRequirement.findMany({
      include: {
        skill: true,
        track: true
      }
    });

    const skillProfiles = await prisma.skillProfile.findMany({
      include: { skill: true }
    });

    // Map profiles: skillId -> array of levels
    const skillLevelMap = new Map<string, number[]>();
    skillProfiles.forEach((sp) => {
      const list = skillLevelMap.get(sp.skillId) || [];
      list.push(sp.level);
      skillLevelMap.set(sp.skillId, list);
    });

    const commonGaps = requirements.map((req) => {
      const levels = skillLevelMap.get(req.skillId) || [];
      const learnersWithAssessment = levels.length;
      let totalGap = 0;
      let learnersWithGap = 0;

      if (levels.length > 0) {
        levels.forEach((lvl) => {
          const gap = Math.max(0, req.requiredLevel - lvl);
          totalGap += gap;
          if (gap > 0) learnersWithGap++;
        });
      } else {
        // Unassessed learners count as default gap
        totalGap = req.requiredLevel - 1;
        learnersWithGap = 1;
      }

      const avgGap = learnersWithAssessment > 0 ? Number((totalGap / learnersWithAssessment).toFixed(1)) : req.requiredLevel - 1;

      return {
        skillName: req.skill.name,
        category: req.skill.category,
        trackName: req.track.name,
        requiredLevel: req.requiredLevel,
        averageGap: avgGap,
        learnersCount: learnersWithGap
      };
    });

    // Sort by largest average gap descending
    commonGaps.sort((a, b) => b.averageGap - a.averageGap);

    // 3. Average Scores per Track
    const tracks = await prisma.track.findMany({
      include: {
        quizzes: {
          include: {
            attempts: true
          }
        }
      }
    });

    const trackAverages = tracks.map((t) => {
      const allAttempts = t.quizzes.flatMap((q) => q.attempts);
      const totalPct = allAttempts.reduce((acc, att) => acc + att.percentage, 0);
      const avgScore = allAttempts.length > 0 ? Math.round(totalPct / allAttempts.length) : 70;

      return {
        trackId: t.id,
        trackName: t.name,
        attemptsCount: allAttempts.length,
        averageScore: avgScore
      };
    });

    // 4. Learner Directory List
    const learners = await prisma.user.findMany({
      where: { role: "learner" },
      include: {
        targetTrack: true,
        quizAttempts: true,
        skillProfiles: true
      },
      take: 15,
      orderBy: { createdAt: "desc" }
    });

    const learnerDirectory = learners.map((l) => {
      const attempts = l.quizAttempts;
      const avgScore =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
          : 0;

      return {
        id: l.id,
        name: l.name,
        email: l.email,
        targetTrack: l.targetTrack?.name || "Unassigned",
        skillsAssessed: l.skillProfiles.length,
        quizzesTaken: attempts.length,
        averageScore: avgScore,
        joinedAt: l.createdAt
      };
    });

    res.json({
      metrics: {
        totalLearners,
        totalTracks,
        totalQuizzes,
        totalAttempts,
        averagePlatformScore
      },
      commonGaps: commonGaps.slice(0, 8),
      trackAverages,
      learners: learnerDirectory
    });
  } catch (err: any) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ error: "Failed to generate admin analytics", details: err.message });
  }
}
