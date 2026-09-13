import prisma from "../prisma.js";
import { generateCourseRecommendationReason } from "../services/ai.service.js";

export const getRecommendedLearningPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { track: true }
    });

    if (!user.trackId) {
      return res.status(400).json({ error: "No track selected." });
    }

    const trackId = user.trackId;

    // 1. Fetch framework and current skill levels
    const framework = await prisma.competencyFramework.findMany({
      where: { trackId },
      include: { skill: true }
    });

    const userSkills = await prisma.userSkillLevel.findMany({
      where: { userId }
    });

    const skillMap = new Map();
    userSkills.forEach(us => skillMap.set(us.skillId, us.currentLevel));

    // Calculate per-skill gap and urgency
    const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const skillGapMap = new Map();
    const activeGapsList = [];

    framework.forEach(fw => {
      const current = skillMap.get(fw.skillId) || 0;
      const gap = Math.max(0, fw.requiredLevel - current);
      const weight = priorityWeights[fw.priority] || 1;
      const urgency = gap * weight;

      skillGapMap.set(fw.skillId, {
        skillId: fw.skillId,
        skillName: fw.skill.name,
        category: fw.skill.category,
        currentLevel: current,
        requiredLevel: fw.requiredLevel,
        gap,
        priority: fw.priority,
        urgency
      });

      if (gap > 0) {
        activeGapsList.push(skillGapMap.get(fw.skillId));
      }
    });

    activeGapsList.sort((a, b) => b.urgency - a.urgency);

    // 2. Fetch all courses in this track with skills taught and enrollments
    const allCourses = await prisma.course.findMany({
      where: { trackId },
      include: {
        skillsTaught: { include: { skill: true } },
        enrollments: { where: { userId } }
      }
    });

    // Determine completed course IDs
    const completedCourseIds = new Set(
      allCourses
        .filter(c => c.enrollments && c.enrollments[0]?.status === "COMPLETED")
        .map(c => c.id)
    );

    const completedCourseTitles = new Set(
      allCourses
        .filter(c => c.enrollments && c.enrollments[0]?.status === "COMPLETED")
        .map(c => c.title.toLowerCase())
    );

    // 3. Score each non-completed course based on learner's live gaps
    const candidates = [];

    for (const course of allCourses) {
      const enrollment = course.enrollments && course.enrollments[0];
      const isCompleted = enrollment?.status === "COMPLETED";
      
      let prerequisitesList = [];
      try {
        prerequisitesList = course.prerequisites ? JSON.parse(course.prerequisites) : [];
      } catch (e) {
        prerequisitesList = [];
      }

      // Check if prerequisites are met
      const prerequisitesMet = prerequisitesList.length === 0 || prerequisitesList.every(prereq => {
        const pLower = prereq.toLowerCase();
        // check if completed course matches or if skill level >= 2
        return completedCourseTitles.has(pLower) || Array.from(skillGapMap.values()).some(s => s.skillName.toLowerCase().includes(pLower) && s.currentLevel >= 2);
      });

      // Calculate how well this course addresses active gaps
      let relevanceScore = 0;
      const targetedGaps = [];

      course.skillsTaught.forEach(mapping => {
        const gapInfo = skillGapMap.get(mapping.skillId);
        if (gapInfo && gapInfo.gap > 0) {
          // Score: gap urgency * level taught by course
          relevanceScore += (gapInfo.urgency * mapping.levelTaught);
          targetedGaps.push({
            skillName: gapInfo.skillName,
            currentLevel: gapInfo.currentLevel,
            requiredLevel: gapInfo.requiredLevel,
            gap: gapInfo.gap,
            priority: gapInfo.priority
          });
        }
      });

      // Level sequencing bonus: Beginner gets bonus if high gaps exist, Advanced gets bonus if near mastery
      if (course.level === "Beginner") relevanceScore += 5;
      if (!prerequisitesMet) relevanceScore -= 10; // defer until prereqs met

      const whyRecommended = await generateCourseRecommendationReason(
        course.title,
        targetedGaps.length > 0 ? targetedGaps : activeGapsList,
        user.targetRole || user.track.name
      );

      candidates.push({
        id: course.id,
        title: course.title,
        description: course.description,
        provider: course.provider,
        durationHours: course.durationHours,
        level: course.level,
        rating: course.rating,
        thumbnail: course.thumbnail,
        prerequisites: prerequisitesList,
        prerequisitesMet,
        relevanceScore,
        targetedGaps,
        whyRecommended,
        enrollmentStatus: enrollment ? enrollment.status : "NOT_ENROLLED",
        progressPercent: enrollment ? enrollment.progressPercent : 0,
        isCompleted
      });
    }

    // 4. Sequence candidates: Active courses first (relevance > 0 and not completed)
    const activeRecommendations = candidates
      .filter(c => !c.isCompleted)
      .sort((a, b) => {
        // Prerequisites met first
        if (a.prerequisitesMet && !b.prerequisitesMet) return -1;
        if (!a.prerequisitesMet && b.prerequisitesMet) return 1;
        // Then highest relevance
        return b.relevanceScore - a.relevanceScore;
      })
      .map((item, index) => ({
        sequenceNumber: index + 1,
        ...item
      }));

    const completedMilestones = candidates
      .filter(c => c.isCompleted)
      .map((item, index) => ({
        sequenceNumber: index + 1,
        ...item
      }));

    // 5. Update or create live LearningPath record in DB
    const summary = activeGapsList.length > 0
      ? `Focused roadmap targeting ${activeGapsList.length} skill deficits in ${user.track.name}. Top priority: ${activeGapsList[0].skillName}.`
      : `Mastery path: All baseline framework requirements in ${user.track.name} are satisfied!`;

    const storedItems = JSON.stringify(activeRecommendations.map(r => ({
      courseId: r.id,
      sequence: r.sequenceNumber,
      title: r.title,
      whyRecommended: r.whyRecommended
    })));

    const existingPath = await prisma.learningPath.findFirst({
      where: { userId, trackId }
    });

    if (existingPath) {
      await prisma.learningPath.update({
        where: { id: existingPath.id },
        data: { summary, items: storedItems, updatedAt: new Date() }
      });
    } else {
      await prisma.learningPath.create({
        data: { userId, trackId, summary, items: storedItems }
      });
    }

    res.json({
      trackName: user.track.name,
      summary,
      totalGapsRemaining: activeGapsList.length,
      topGapSkill: activeGapsList[0]?.skillName || "All competencies met",
      recommendations: activeRecommendations,
      completedMilestones
    });
  } catch (error) {
    console.error("getRecommendedLearningPath error:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
};
