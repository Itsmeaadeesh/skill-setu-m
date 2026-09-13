import prisma from "../prisma.js";

export const getAllTracks = async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      include: {
        _count: {
          select: {
            courses: true,
            competencies: true,
            users: true
          }
        }
      }
    });
    res.json(tracks);
  } catch (error) {
    console.error("getAllTracks error:", error);
    res.status(500).json({ error: "Failed to fetch tracks." });
  }
};

export const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        competencies: {
          include: { skill: true }
        },
        courses: {
          include: {
            skillsTaught: { include: { skill: true } }
          }
        },
        quizzes: {
          where: { isPublished: true }
        }
      }
    });

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    res.json(track);
  } catch (error) {
    console.error("getTrackById error:", error);
    res.status(500).json({ error: "Failed to fetch track details." });
  }
};

export const getTrackCompetencies = async (req, res) => {
  try {
    const { id } = req.params;
    const competencies = await prisma.competencyFramework.findMany({
      where: { trackId: id },
      include: { skill: true }
    });
    res.json(competencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch track competencies." });
  }
};
