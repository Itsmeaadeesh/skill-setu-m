import prisma from "../prisma.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Overall counts
    const totalLearners = await prisma.user.count({ where: { role: "LEARNER" } });
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const completedEnrollments = await prisma.enrollment.count({ where: { status: "COMPLETED" } });
    const totalAttempts = await prisma.quizAttempt.count();

    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    const avgScoreResult = await prisma.quizAttempt.aggregate({
      _avg: { percentage: true }
    });
    const averageQuizScore = Math.round(avgScoreResult._avg.percentage || 0);

    // 2. Track Distribution (Pie / Bar)
    const tracks = await prisma.track.findMany({
      include: {
        _count: { select: { users: true, courses: true } }
      }
    });

    const trackDistribution = tracks.map(t => ({
      name: t.name,
      slug: t.slug,
      learnersCount: t._count.users,
      coursesCount: t._count.courses,
      color: t.color
    }));

    // 3. Competency Level Distribution (Count of skill levels 1-5 across all learners)
    const allSkillLevels = await prisma.userSkillLevel.findMany();
    const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allSkillLevels.forEach(sl => {
      const lvl = Math.max(1, Math.min(5, sl.currentLevel));
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    });

    const levelDistribution = [
      { level: "Level 1 (Novice)", count: levelCounts[1], fill: "#f87171" },
      { level: "Level 2 (Advanced Beginner)", count: levelCounts[2], fill: "#fbbf24" },
      { level: "Level 3 (Competent)", count: levelCounts[3], fill: "#60a5fa" },
      { level: "Level 4 (Proficient)", count: levelCounts[4], fill: "#818cf8" },
      { level: "Level 5 (Master)", count: levelCounts[5], fill: "#34d399" }
    ];

    // 4. Aggregate Skill Gap Heatmap
    // Calculate average gap per skill across all learners in their respective tracks
    const allFrameworks = await prisma.competencyFramework.findMany({
      include: { skill: true, track: true }
    });

    const skillGapAggregation = new Map();

    for (const fw of allFrameworks) {
      if (!skillGapAggregation.has(fw.skillId)) {
        skillGapAggregation.set(fw.skillId, {
          skillId: fw.skillId,
          skillName: fw.skill.name,
          category: fw.skill.category,
          requiredLevel: fw.requiredLevel,
          totalCurrent: 0,
          learnerCount: 0
        });
      }
    }

    allSkillLevels.forEach(sl => {
      if (skillGapAggregation.has(sl.skillId)) {
        const item = skillGapAggregation.get(sl.skillId);
        item.totalCurrent += sl.currentLevel;
        item.learnerCount += 1;
      }
    });

    const aggregateHeatmap = Array.from(skillGapAggregation.values()).map(item => {
      const avgCurrent = item.learnerCount > 0 ? (item.totalCurrent / item.learnerCount) : 1;
      const avgGap = Math.max(0, item.requiredLevel - avgCurrent);
      return {
        skillId: item.skillId,
        skillName: item.skillName,
        category: item.category,
        requiredLevel: item.requiredLevel,
        avgCurrentLevel: parseFloat(avgCurrent.toFixed(1)),
        avgGap: parseFloat(avgGap.toFixed(1)),
        urgency: avgGap >= 1.5 ? "CRITICAL" : avgGap >= 0.8 ? "MODERATE" : "LOW"
      };
    });

    aggregateHeatmap.sort((a, b) => b.avgGap - a.avgGap);

    // 5. Recent Learner Activity
    const recentAttempts = await prisma.quizAttempt.findMany({
      take: 8,
      orderBy: { completedAt: "desc" },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        quiz: { select: { title: true } }
      }
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      take: 8,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        course: { select: { title: true } }
      }
    });

    // 6. Review Queue Count
    const pendingReviewCount = await prisma.quiz.count({ where: { isPublished: false } });

    res.json({
      summary: {
        totalLearners,
        totalCourses,
        completionRate,
        averageQuizScore,
        totalAttempts,
        pendingReviewCount
      },
      trackDistribution,
      levelDistribution,
      aggregateHeatmap: aggregateHeatmap.slice(0, 15),
      topCriticalGaps: aggregateHeatmap.slice(0, 5),
      recentActivity: {
        attempts: recentAttempts,
        enrollments: recentEnrollments
      }
    });
  } catch (error) {
    console.error("getAdminAnalytics error:", error);
    res.status(500).json({ error: "Failed to fetch admin analytics." });
  }
};

export const exportAnalyticsCSV = async (req, res) => {
  try {
    const learners = await prisma.user.findMany({
      where: { role: "LEARNER" },
      include: {
        track: true,
        skillLevels: { include: { skill: true } },
        enrollments: { include: { course: true } },
        quizAttempts: true
      }
    });

    const headers = [
      "Student Name",
      "Email",
      "Learning Track",
      "Education Level",
      "Experience (Yrs)",
      "Enrolled Courses",
      "Completed Courses",
      "Quizzes Taken",
      "Avg Quiz Score (%)",
      "Assessed Skills Count",
      "Top Skill Gaps"
    ];

    const rows = learners.map(learner => {
      const completedCount = learner.enrollments.filter(e => e.status === "COMPLETED").length;
      const quizCount = learner.quizAttempts.length;
      const avgScore = quizCount > 0
        ? Math.round(learner.quizAttempts.reduce((acc, a) => acc + a.percentage, 0) / quizCount)
        : 0;

      // Identify gaps (skills with level < 3)
      const gaps = learner.skillLevels
        .filter(s => s.currentLevel < 3)
        .map(s => `${s.skill.name}(Lvl ${s.currentLevel})`)
        .slice(0, 3)
        .join("; ");

      return [
        `"${learner.name}"`,
        `"${learner.email}"`,
        `"${learner.track ? learner.track.name : "Unassigned"}"`,
        `"${learner.educationLevel || "N/A"}"`,
        learner.experienceYears || 0,
        learner.enrollments.length,
        completedCount,
        quizCount,
        avgScore,
        learner.skillLevels.length,
        `"${gaps || "None"}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="skill-setu-students-report-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error("exportAnalyticsCSV error:", error);
    res.status(500).json({ error: "Failed to export CSV." });
  }
};
