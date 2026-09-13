import prisma from "../prisma.js";

export const getMySkillGaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { track: true }
    });

    if (!user.trackId) {
      return res.status(400).json({ error: "User has not selected a learning track." });
    }

    const trackId = user.trackId;

    // Fetch competency framework for this track
    const framework = await prisma.competencyFramework.findMany({
      where: { trackId },
      include: { skill: true }
    });

    // Fetch learner's current skill levels
    const userSkills = await prisma.userSkillLevel.findMany({
      where: { userId }
    });

    const userSkillMap = new Map();
    userSkills.forEach(us => userSkillMap.set(us.skillId, us.currentLevel));

    let totalRequired = 0;
    let totalAcquired = 0;
    const gapsList = [];
    const radarData = [];
    const heatmapData = [];

    const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    framework.forEach(fw => {
      const currentLevel = userSkillMap.get(fw.skillId) || 0;
      const requiredLevel = fw.requiredLevel;
      const rawGap = requiredLevel - currentLevel;
      const gap = Math.max(0, rawGap);

      totalRequired += requiredLevel;
      totalAcquired += Math.min(currentLevel, requiredLevel);

      const priorityWeight = priorityWeights[fw.priority] || 1;
      const urgencyScore = gap * priorityWeight;

      let status = "GAP";
      if (currentLevel >= requiredLevel) {
        status = currentLevel > requiredLevel ? "EXCEEDED" : "MASTERED";
      } else if (currentLevel >= requiredLevel - 1 && requiredLevel > 1) {
        status = "NEAR_TARGET";
      }

      const item = {
        skillId: fw.skillId,
        skillName: fw.skill.name,
        category: fw.skill.category,
        currentLevel,
        requiredLevel,
        gap,
        priority: fw.priority,
        urgencyScore,
        status
      };

      gapsList.push(item);

      radarData.push({
        skill: fw.skill.name,
        category: fw.skill.category,
        current: currentLevel,
        required: requiredLevel,
        fullMark: 5
      });

      heatmapData.push({
        skillId: fw.skillId,
        skillName: fw.skill.name,
        category: fw.skill.category,
        currentLevel,
        requiredLevel,
        gap,
        status
      });
    });

    // Sort gaps: highest urgency first (gap > 0 first, sorted by urgencyScore descending)
    gapsList.sort((a, b) => b.urgencyScore - a.urgencyScore);

    const readinessPercentage = totalRequired > 0 
      ? Math.round((totalAcquired / totalRequired) * 100) 
      : 0;

    const criticalGapsCount = gapsList.filter(g => g.gap >= 2 && g.priority === "HIGH").length;
    const moderateGapsCount = gapsList.filter(g => g.gap === 1 || (g.gap > 0 && g.priority !== "HIGH")).length;
    const masteredCount = gapsList.filter(g => g.gap === 0).length;

    res.json({
      track: {
        id: user.track.id,
        name: user.track.name,
        slug: user.track.slug
      },
      readinessPercentage,
      stats: {
        totalSkills: framework.length,
        criticalGapsCount,
        moderateGapsCount,
        masteredCount
      },
      radarData,
      heatmapData,
      rankedGaps: gapsList,
      topGaps: gapsList.filter(g => g.gap > 0).slice(0, 5)
    });
  } catch (error) {
    console.error("getMySkillGaps error:", error);
    res.status(500).json({ error: "Failed to compute skill gap analysis." });
  }
};
