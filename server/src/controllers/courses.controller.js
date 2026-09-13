import prisma from "../prisma.js";

export const getAllCourses = async (req, res) => {
  try {
    const { trackId, level, search } = req.query;
    const userId = req.user ? req.user.id : null;

    const where = {};
    if (trackId) where.trackId = trackId;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        track: true,
        skillsTaught: {
          include: { skill: true }
        },
        enrollments: userId ? {
          where: { userId }
        } : false
      },
      orderBy: { rating: "desc" }
    });

    const formatted = courses.map(course => {
      let prerequisitesList = [];
      try {
        prerequisitesList = course.prerequisites ? JSON.parse(course.prerequisites) : [];
      } catch (e) {
        prerequisitesList = [];
      }

      const userEnrollment = course.enrollments && course.enrollments[0] ? course.enrollments[0] : null;

      return {
        ...course,
        prerequisites: prerequisitesList,
        enrollmentStatus: userEnrollment ? userEnrollment.status : "NOT_ENROLLED",
        progressPercent: userEnrollment ? userEnrollment.progressPercent : 0
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("getAllCourses error:", error);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        track: true,
        skillsTaught: {
          include: { skill: true }
        },
        enrollments: userId ? {
          where: { userId }
        } : false
      }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    let prerequisitesList = [];
    try {
      prerequisitesList = course.prerequisites ? JSON.parse(course.prerequisites) : [];
    } catch (e) {
      prerequisitesList = [];
    }

    let syllabusList = [];
    try {
      syllabusList = course.syllabus ? JSON.parse(course.syllabus) : [];
    } catch (e) {
      syllabusList = [];
    }

    const userEnrollment = course.enrollments && course.enrollments[0] ? course.enrollments[0] : null;

    res.json({
      ...course,
      prerequisites: prerequisitesList,
      syllabus: syllabusList,
      enrollmentStatus: userEnrollment ? userEnrollment.status : "NOT_ENROLLED",
      progressPercent: userEnrollment ? userEnrollment.progressPercent : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course details." });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required." });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      create: {
        userId,
        courseId,
        status: "IN_PROGRESS",
        progressPercent: 10
      },
      update: {
        status: "IN_PROGRESS"
      },
      include: { course: true }
    });

    res.json({
      message: `Enrolled in "${enrollment.course.title}"!`,
      enrollment
    });
  } catch (error) {
    console.error("enrollCourse error:", error);
    res.status(500).json({ error: "Failed to enroll in course." });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { progressPercent } = req.body;

    const clamped = Math.max(0, Math.min(100, parseInt(progressPercent) || 0));
    const status = clamped >= 100 ? "COMPLETED" : "IN_PROGRESS";

    const enrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: { userId, courseId: id }
      },
      data: {
        progressPercent: clamped,
        status,
        completedAt: status === "COMPLETED" ? new Date() : null
      },
      include: { course: true }
    });

    res.json({
      message: `Progress updated to ${clamped}%`,
      enrollment
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update course progress." });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 1. Mark Enrollment completed
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId: id }
      },
      create: {
        userId,
        courseId: id,
        status: "COMPLETED",
        progressPercent: 100,
        completedAt: new Date()
      },
      update: {
        status: "COMPLETED",
        progressPercent: 100,
        completedAt: new Date()
      },
      include: {
        course: {
          include: {
            skillsTaught: { include: { skill: true } }
          }
        }
      }
    });

    // 2. Real Skill Proficiency Bump: Update UserSkillLevel for every skill taught by this course
    const updatedSkills = [];
    for (const mapping of enrollment.course.skillsTaught) {
      const existing = await prisma.userSkillLevel.findUnique({
        where: {
          userId_skillId: { userId, skillId: mapping.skillId }
        }
      });

      const currentLevel = existing ? existing.currentLevel : 0;
      // Bump skill level: increase towards levelTaught (at least +1, up to levelTaught, max 5)
      const newLevel = Math.min(5, Math.max(currentLevel + 1, mapping.levelTaught));

      const updated = await prisma.userSkillLevel.upsert({
        where: {
          userId_skillId: { userId, skillId: mapping.skillId }
        },
        create: {
          userId,
          skillId: mapping.skillId,
          currentLevel: newLevel,
          source: "COURSE_COMPLETION",
          lastAssessedAt: new Date()
        },
        update: {
          currentLevel: newLevel,
          source: "COURSE_COMPLETION",
          lastAssessedAt: new Date()
        },
        include: { skill: true }
      });

      updatedSkills.push({
        skillName: updated.skill.name,
        oldLevel: currentLevel,
        newLevel: updated.currentLevel
      });
    }

    res.json({
      message: `Course completed! Proficiency increased in ${updatedSkills.length} skills.`,
      enrollment,
      updatedSkills
    });
  } catch (error) {
    console.error("completeCourse error:", error);
    res.status(500).json({ error: "Failed to complete course." });
  }
};
