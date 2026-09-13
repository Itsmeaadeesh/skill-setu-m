import prisma from "../prisma.js";

export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills." });
  }
};

export const getUserSkillLevels = async (req, res) => {
  try {
    const userId = req.user.id;
    const levels = await prisma.userSkillLevel.findMany({
      where: { userId },
      include: { skill: true }
    });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user skill levels." });
  }
};

export const updateSkillLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId, level, source = "SELF_RATING" } = req.body;

    const clampedLevel = Math.max(1, Math.min(5, parseInt(level) || 1));

    const updated = await prisma.userSkillLevel.upsert({
      where: {
        userId_skillId: { userId, skillId }
      },
      create: {
        userId,
        skillId,
        currentLevel: clampedLevel,
        source,
        lastAssessedAt: new Date()
      },
      update: {
        currentLevel: clampedLevel,
        source,
        lastAssessedAt: new Date()
      },
      include: { skill: true }
    });

    res.json({
      message: `Updated ${updated.skill.name} to Level ${clampedLevel}`,
      skillLevel: updated
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update skill level." });
  }
};

export const submitSelfRatingAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ratings } = req.body; // Array of { skillId, level }

    if (!Array.isArray(ratings) || ratings.length === 0) {
      return res.status(400).json({ error: "Ratings array is required." });
    }

    const results = [];
    for (const item of ratings) {
      const clampedLevel = Math.max(1, Math.min(5, parseInt(item.level) || 1));
      const record = await prisma.userSkillLevel.upsert({
        where: {
          userId_skillId: { userId, skillId: item.skillId }
        },
        create: {
          userId,
          skillId: item.skillId,
          currentLevel: clampedLevel,
          source: "SELF_RATING",
          lastAssessedAt: new Date()
        },
        update: {
          currentLevel: clampedLevel,
          source: "SELF_RATING",
          lastAssessedAt: new Date()
        }
      });
      results.push(record);
    }

    res.json({
      message: `Self-assessment saved for ${results.length} skills.`,
      updatedCount: results.length
    });
  } catch (error) {
    console.error("submitSelfRating error:", error);
    res.status(500).json({ error: "Failed to submit self-rating assessment." });
  }
};
