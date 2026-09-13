import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { tracksData } from "./tracksData.js";
import { skillsData } from "./skillsData.js";
import { getCoursesData } from "./coursesData.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Skill Setu Database Seeding...");

  // Clean tables
  await prisma.chatMessage.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.uploadedContent.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.courseSkillMapping.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userSkillLevel.deleteMany();
  await prisma.competencyFramework.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.track.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. Tracks
  console.log("Seeding Tracks...");
  const trackMap = new Map();
  for (const t of tracksData) {
    const created = await prisma.track.create({ data: t });
    trackMap.set(t.slug, created);
  }

  const trackWeb = trackMap.get("full-stack-web");
  const trackData = trackMap.get("data-science-ai");
  const trackCloud = trackMap.get("cloud-devops");
  const trackCS = trackMap.get("core-cs-dsa");

  // 2. Skills
  console.log("Seeding Skills...");
  const skillMap = new Map();
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.slug, created);
  }

  // 3. Competency Frameworks
  console.log("Seeding Frameworks...");
  const frameworks = [
    { trackId: trackWeb.id, skillSlug: "javascript-es6", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackWeb.id, skillSlug: "react-state", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackWeb.id, skillSlug: "node-express", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackWeb.id, skillSlug: "sql-databases", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackWeb.id, skillSlug: "rest-api-security", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackWeb.id, skillSlug: "tailwind-css", requiredLevel: 3, priority: "MEDIUM" },
    { trackId: trackWeb.id, skillSlug: "typescript", requiredLevel: 4, priority: "MEDIUM" },
    { trackId: trackWeb.id, skillSlug: "web-performance", requiredLevel: 3, priority: "MEDIUM" },
    { trackId: trackWeb.id, skillSlug: "web-testing", requiredLevel: 3, priority: "MEDIUM" },

    { trackId: trackData.id, skillSlug: "python-data", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackData.id, skillSlug: "applied-statistics", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackData.id, skillSlug: "machine-learning", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackData.id, skillSlug: "feature-engineering", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackData.id, skillSlug: "deep-learning-pytorch", requiredLevel: 3, priority: "MEDIUM" },
    { trackId: trackData.id, skillSlug: "data-visualization", requiredLevel: 4, priority: "MEDIUM" },
    { trackId: trackData.id, skillSlug: "nlp-foundations", requiredLevel: 3, priority: "MEDIUM" },

    { trackId: trackCloud.id, skillSlug: "linux-sysadmin", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackCloud.id, skillSlug: "docker", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackCloud.id, skillSlug: "kubernetes", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackCloud.id, skillSlug: "ci-cd-pipelines", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackCloud.id, skillSlug: "cloud-architecture", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackCloud.id, skillSlug: "terraform", requiredLevel: 4, priority: "MEDIUM" },

    { trackId: trackCS.id, skillSlug: "dsa-structures", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackCS.id, skillSlug: "dsa-algorithms", requiredLevel: 5, priority: "HIGH" },
    { trackId: trackCS.id, skillSlug: "operating-systems", requiredLevel: 4, priority: "HIGH" },
    { trackId: trackCS.id, skillSlug: "computer-networks", requiredLevel: 4, priority: "HIGH" }
  ];

  for (const fw of frameworks) {
    const sk = skillMap.get(fw.skillSlug);
    if (sk) {
      await prisma.competencyFramework.create({
        data: {
          trackId: fw.trackId,
          skillId: sk.id,
          requiredLevel: fw.requiredLevel,
          priority: fw.priority
        }
      });
    }
  }

  // 4. Courses
  console.log("Seeding Courses...");
  const coursesList = getCoursesData({
    trackWebId: trackWeb.id,
    trackDataId: trackData.id,
    trackCloudId: trackCloud.id,
    trackCSId: trackCS.id
  });

  const createdCourses = [];
  for (const c of coursesList) {
    const { skills, ...courseData } = c;
    const course = await prisma.course.create({ data: courseData });
    createdCourses.push(course);

    for (const sm of skills) {
      const sk = skillMap.get(sm.slug);
      if (sk) {
        await prisma.courseSkillMapping.create({
          data: {
            courseId: course.id,
            skillId: sk.id,
            levelTaught: sm.level
          }
        });
      }
    }
  }

  // 5. System Users
  console.log("Seeding Admin, Trainer, Learner Accounts...");
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@skillsetu.edu",
      password: defaultPassword,
      name: "Dr. Arvind Rao",
      role: "ADMIN",
      educationLevel: "Doctorate",
      experienceYears: 12,
      targetRole: "Dean of Engineering",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArvindRao",
      hasOnboarded: true
    }
  });

  const trainerUser = await prisma.user.create({
    data: {
      email: "trainer@skillsetu.edu",
      password: defaultPassword,
      name: "Prof. Ananya Sen",
      role: "TRAINER",
      educationLevel: "Postgraduate",
      experienceYears: 8,
      targetRole: "Lead Technical Trainer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaSen",
      hasOnboarded: true
    }
  });

  const primaryLearner = await prisma.user.create({
    data: {
      email: "learner@skillsetu.edu",
      password: defaultPassword,
      name: "Aadeesh Sharma",
      role: "LEARNER",
      educationLevel: "Undergraduate (B.Tech CS, 3rd Year)",
      experienceYears: 1,
      targetRole: "Full Stack Engineer",
      trackId: trackWeb.id,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AadeeshSharma",
      hasOnboarded: true
    }
  });

  // Assign baseline skill levels to primary learner (showing genuine gaps)
  const initialSkillLevels = [
    { slug: "javascript-es6", level: 3 },
    { slug: "react-state", level: 2 },
    { slug: "node-express", level: 2 },
    { slug: "sql-databases", level: 1 },
    { slug: "rest-api-security", level: 1 },
    { slug: "tailwind-css", level: 3 },
    { slug: "typescript", level: 1 },
    { slug: "web-performance", level: 1 },
    { slug: "web-testing", level: 1 }
  ];

  for (const s of initialSkillLevels) {
    const sk = skillMap.get(s.slug);
    if (sk) {
      await prisma.userSkillLevel.create({
        data: {
          userId: primaryLearner.id,
          skillId: sk.id,
          currentLevel: s.level,
          source: "BASELINE"
        }
      });
    }
  }

  // 6. 15 Additional Learners
  console.log("Seeding 15 Additional Learners...");
  const cohort = [
    { name: "Rohan Varma", email: "rohan.v@student.edu", trackId: trackWeb.id },
    { name: "Priya Nair", email: "priya.n@student.edu", trackId: trackWeb.id },
    { name: "Siddharth Mehta", email: "sid.mehta@student.edu", trackId: trackWeb.id },
    { name: "Neha Kulkarni", email: "neha.k@student.edu", trackId: trackData.id },
    { name: "Aditya Verma", email: "aditya.v@student.edu", trackId: trackData.id },
    { name: "Tanvi Saxena", email: "tanvi.s@student.edu", trackId: trackData.id },
    { name: "Kabir Das", email: "kabir.d@student.edu", trackId: trackData.id },
    { name: "Meera Joshi", email: "meera.j@student.edu", trackId: trackCloud.id },
    { name: "Arjun Reddy", email: "arjun.r@student.edu", trackId: trackCloud.id },
    { name: "Divya Pillai", email: "divya.p@student.edu", trackId: trackCloud.id },
    { name: "Harsh Patel", email: "harsh.p@student.edu", trackId: trackCloud.id },
    { name: "Vikram Malhotra", email: "vikram.m@student.edu", trackId: trackCS.id },
    { name: "Ishita Roy", email: "ishita.r@student.edu", trackId: trackCS.id },
    { name: "Gaurav Gupta", email: "gaurav.g@student.edu", trackId: trackCS.id },
    { name: "Ananya Iyer", email: "ananya.i@student.edu", trackId: trackWeb.id }
  ];

  for (let i = 0; i < cohort.length; i++) {
    const c = cohort[i];
    const u = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        password: defaultPassword,
        role: "LEARNER",
        educationLevel: "Undergraduate",
        experienceYears: 1.0,
        trackId: c.trackId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name)}`,
        hasOnboarded: true
      }
    });

    const trackFws = await prisma.competencyFramework.findMany({ where: { trackId: c.trackId } });
    for (const fw of trackFws) {
      const lvl = Math.floor(Math.random() * 4) + 1;
      await prisma.userSkillLevel.create({
        data: {
          userId: u.id,
          skillId: fw.skillId,
          currentLevel: lvl,
          source: i % 2 === 0 ? "BASELINE" : "QUIZ"
        }
      });
    }

    const tCourses = createdCourses.filter(cr => cr.trackId === c.trackId);
    if (tCourses.length > 0) {
      await prisma.enrollment.create({
        data: {
          userId: u.id,
          courseId: tCourses[0].id,
          status: i % 3 === 0 ? "COMPLETED" : "IN_PROGRESS",
          progressPercent: i % 3 === 0 ? 100 : 50,
          completedAt: i % 3 === 0 ? new Date() : null
        }
      });
    }
  }

  // 7. Baseline Quizzes
  console.log("Seeding Quizzes & Question Bank...");
  const webQuiz = await prisma.quiz.create({
    data: {
      title: "Full Stack Web Engineering Baseline Quiz",
      description: "Diagnostic assessment of core JavaScript, React, async patterns, and REST security.",
      trackId: trackWeb.id,
      isBaseline: true,
      isPublished: true,
      createdById: trainerUser.id
    }
  });

  const questions = [
    {
      questionText: "What does the JavaScript Event Loop do when executing asynchronous Promises?",
      optionA: "Executes them immediately on the call stack blocking the UI thread",
      optionB: "Places their callbacks onto the Microtask Queue to run right after current script execution",
      optionC: "Spawns a separate OS thread for each Promise callback",
      optionD: "Delegates all execution directly to Web Workers",
      correctAnswer: "B",
      explanation: "Promises use the Microtask Queue, which has priority over the Macrotask queue.",
      difficulty: "MEDIUM"
    },
    {
      questionText: "Which HTTP security header is most crucial for preventing Cross-Site Scripting (XSS)?",
      optionA: "Content-Security-Policy (CSP)",
      optionB: "Access-Control-Allow-Origin",
      optionC: "X-Frame-Options",
      optionD: "Cache-Control",
      correctAnswer: "A",
      explanation: "Content-Security-Policy restricts sources from which executable scripts and styles can be loaded.",
      difficulty: "MEDIUM"
    },
    {
      questionText: "In relational databases, what does the 'I' in ACID transaction guarantees signify?",
      optionA: "Immediate indexing of all inserted tuples",
      optionB: "Immutability of transaction logs",
      optionC: "Isolation: concurrent transactions do not interfere with one another",
      optionD: "Integrity checking against foreign keys exclusively",
      correctAnswer: "C",
      explanation: "Isolation ensures concurrent transactions execute without race conditions or dirty reads.",
      difficulty: "EASY"
    },
    {
      questionText: "In React 18/19, what is the primary purpose of the useTransition hook?",
      optionA: "To disable virtual DOM diffing",
      optionB: "To mark non-urgent state updates as interruptible so user interactions stay responsive",
      optionC: "To replace Redux and Context API",
      optionD: "To perform server database mutations directly",
      correctAnswer: "B",
      explanation: "useTransition lets developers prioritize urgent updates over expensive background rendering.",
      difficulty: "HARD"
    }
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        quizId: webQuiz.id,
        ...q,
        sourceTag: "Curated Baseline"
      }
    });
  }

  // Initial attempt for primary learner
  await prisma.quizAttempt.create({
    data: {
      userId: primaryLearner.id,
      quizId: webQuiz.id,
      score: 3,
      totalQuestions: 4,
      percentage: 75.0,
      passed: true
    }
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
