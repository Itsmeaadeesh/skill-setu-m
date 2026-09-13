import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Skill Setu Database Seeding...");

  // 1. Clean existing records in reverse dependency order
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.course.deleteMany();
  await prisma.skillProfile.deleteMany();
  await prisma.trackRequirement.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.track.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 2. Seed Tracks
  const frontendTrack = await prisma.track.create({
    data: {
      name: "Frontend Developer",
      slug: "frontend-developer",
      description: "Master modern UI development with React, TypeScript, responsive layout systems, and client-side architecture.",
      icon: "Layout",
      color: "indigo"
    }
  });

  const dataAnalystTrack = await prisma.track.create({
    data: {
      name: "Data Analyst",
      slug: "data-analyst",
      description: "Extract insights, run complex SQL queries, build visualizations, and perform exploratory data analysis with Python.",
      icon: "BarChart3",
      color: "emerald"
    }
  });

  const fullStackAITrack = await prisma.track.create({
    data: {
      name: "Full Stack & AI Engineer",
      slug: "fullstack-ai-engineer",
      description: "Build end-to-end intelligent applications with Node.js, Express, PostgreSQL, and LLM integrations via Gemini API.",
      icon: "Cpu",
      color: "purple"
    }
  });

  // 3. Seed Skills
  const skillsData = [
    // Frontend Track Skills
    { name: "React.js", slug: "react-js", category: "Frontend", description: "Declarative UI, component lifecycle, hooks, and virtual DOM concepts.", icon: "Atom" },
    { name: "TypeScript", slug: "typescript", category: "Frontend", description: "Static typing, generics, interfaces, and safe modern JavaScript development.", icon: "Code2" },
    { name: "Tailwind & Modern CSS", slug: "tailwind-css", category: "Frontend", description: "Utility-first CSS, responsive layouts, CSS Grid, Flexbox, and modern pseudo-classes.", icon: "Palette" },
    { name: "State Management", slug: "state-management", category: "Frontend", description: "React Context, Zustand, Redux Toolkit, and optimistic UI updates.", icon: "Layers" },
    { name: "Web Performance & CWV", slug: "web-performance", category: "Frontend", description: "Core Web Vitals (LCP, INP, CLS), code splitting, caching, and Lighthouse audits.", icon: "Zap" },

    // Data Analyst Skills
    { name: "SQL & Relational DBs", slug: "sql-relational-dbs", category: "Data", description: "Complex joins, window functions, CTEs, indexing, and schema design.", icon: "Database" },
    { name: "Python for Data Analysis", slug: "python-data", category: "Data", description: "Pandas, NumPy, data munging, and automated ETL data scripts.", icon: "Terminal" },
    { name: "Data Visualization & BI", slug: "data-visualization", category: "Data", description: "Storytelling with charts, Recharts, Tableau/PowerBI, and metric design.", icon: "PieChart" },
    { name: "Statistical Thinking", slug: "statistical-thinking", category: "Data", description: "A/B testing, hypothesis testing, probability distributions, and significance.", icon: "TrendingUp" },
    { name: "Cloud Data Warehouses", slug: "cloud-data-warehouses", category: "Data", description: "BigQuery, Snowflake partitioning, clustering, and cost optimization.", icon: "Cloud" },

    // Full Stack & AI Skills
    { name: "Node.js & Express", slug: "nodejs-express", category: "Backend", description: "Asynchronous I/O, REST routing, middleware pipelines, and error handling.", icon: "Server" },
    { name: "PostgreSQL & Prisma", slug: "postgresql-prisma", category: "Backend", description: "Relational modeling, migrations, foreign key constraints, and transactions.", icon: "HardDrive" },
    { name: "Generative AI & LLMs", slug: "generative-ai-llms", category: "AI", description: "Prompt engineering, Gemini API SDK, structured JSON outputs, and RAG pipelines.", icon: "Sparkles" },
    { name: "REST & Web APIs", slug: "rest-web-apis", category: "Backend", description: "HTTP semantics, status codes, authentication, JWTs, and rate limiting.", icon: "Network" },
    { name: "System Design Basics", slug: "system-design", category: "Architecture", description: "Scalability, caching strategies, load balancing, and microservices concepts.", icon: "Boxes" }
  ];

  const createdSkills: Record<string, any> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    createdSkills[s.slug] = created;
  }

  // 4. Seed Track Requirements
  // Frontend track requirements (target proficiency 1-5)
  const frontendReqs = [
    { skillSlug: "react-js", level: 4 },
    { skillSlug: "typescript", level: 4 },
    { skillSlug: "tailwind-css", level: 3 },
    { skillSlug: "state-management", level: 3 },
    { skillSlug: "web-performance", level: 3 }
  ];
  for (const req of frontendReqs) {
    await prisma.trackRequirement.create({
      data: {
        trackId: frontendTrack.id,
        skillId: createdSkills[req.skillSlug].id,
        requiredLevel: req.level
      }
    });
  }

  // Data Analyst track requirements
  const dataReqs = [
    { skillSlug: "sql-relational-dbs", level: 5 },
    { skillSlug: "python-data", level: 4 },
    { skillSlug: "data-visualization", level: 4 },
    { skillSlug: "statistical-thinking", level: 3 },
    { skillSlug: "cloud-data-warehouses", level: 3 }
  ];
  for (const req of dataReqs) {
    await prisma.trackRequirement.create({
      data: {
        trackId: dataAnalystTrack.id,
        skillId: createdSkills[req.skillSlug].id,
        requiredLevel: req.level
      }
    });
  }

  // Full Stack AI track requirements
  const aiReqs = [
    { skillSlug: "nodejs-express", level: 4 },
    { skillSlug: "postgresql-prisma", level: 4 },
    { skillSlug: "generative-ai-llms", level: 4 },
    { skillSlug: "rest-web-apis", level: 4 },
    { skillSlug: "react-js", level: 3 }
  ];
  for (const req of aiReqs) {
    await prisma.trackRequirement.create({
      data: {
        trackId: fullStackAITrack.id,
        skillId: createdSkills[req.skillSlug].id,
        requiredLevel: req.level
      }
    });
  }

  // 5. Seed Courses (Foundational, Intermediate, Advanced)
  const coursesData = [
    // React courses
    {
      title: "React Fundamentals & Component Architecture",
      description: "Master JSX, component decomposition, props, state, and unidirectional data flow from scratch.",
      skillSlug: "react-js",
      trackId: frontendTrack.id,
      difficulty: "foundational",
      durationHours: 8,
      provider: "Skill Setu Academy",
      rating: 4.8
    },
    {
      title: "Advanced React Hooks & Custom Hook Patterns",
      description: "Deep dive into useEffect pitfalls, useMemo/useCallback optimization, and reusable custom hook abstractions.",
      skillSlug: "react-js",
      trackId: frontendTrack.id,
      difficulty: "intermediate",
      durationHours: 12,
      provider: "Skill Setu Academy",
      rating: 4.9
    },
    {
      title: "Production React 19 Architecture & Server Actions",
      description: "Scale large enterprise React applications with React 19 hooks, Suspense, and resilient error boundaries.",
      skillSlug: "react-js",
      trackId: frontendTrack.id,
      difficulty: "advanced",
      durationHours: 14,
      provider: "Skill Setu Academy",
      rating: 4.9
    },

    // TypeScript courses
    {
      title: "TypeScript Essentials for JavaScript Developers",
      description: "Understand static types, type inference, union types, and compile-time guarantees.",
      skillSlug: "typescript",
      trackId: frontendTrack.id,
      difficulty: "foundational",
      durationHours: 6,
      provider: "CodeCraft Institute",
      rating: 4.7
    },
    {
      title: "Intermediate TypeScript: Generics & Utility Types",
      description: "Learn generic functions, mapped types, Pick, Omit, Partial, and strict compiler configurations.",
      skillSlug: "typescript",
      trackId: frontendTrack.id,
      difficulty: "intermediate",
      durationHours: 10,
      provider: "CodeCraft Institute",
      rating: 4.8
    },
    {
      title: "Advanced TypeScript: Type Gymnastics & ASTs",
      description: "Conditional types, template literal types, infer keyword, and building rock-solid SDK APIs.",
      skillSlug: "typescript",
      trackId: frontendTrack.id,
      difficulty: "advanced",
      durationHours: 12,
      provider: "CodeCraft Institute",
      rating: 4.9
    },

    // Tailwind & CSS
    {
      title: "Modern CSS & Responsive Tailwind Mastery",
      description: "Rapidly build responsive, polished layouts with Flexbox, CSS Grid, and Tailwind utility classes.",
      skillSlug: "tailwind-css",
      trackId: frontendTrack.id,
      difficulty: "foundational",
      durationHours: 6,
      provider: "Skill Setu Academy",
      rating: 4.7
    },
    {
      title: "Advanced Design Systems & Tailwind Theming",
      description: "Build reusable UI component systems with dark mode, animations, and container queries.",
      skillSlug: "tailwind-css",
      trackId: frontendTrack.id,
      difficulty: "intermediate",
      durationHours: 8,
      provider: "Skill Setu Academy",
      rating: 4.8
    },

    // State Management
    {
      title: "State Management with React Context & Zustand",
      description: "Clean state management without boilerplate using Zustand stores and React Context best practices.",
      skillSlug: "state-management",
      trackId: frontendTrack.id,
      difficulty: "intermediate",
      durationHours: 7,
      provider: "Frontend Masters",
      rating: 4.8
    },

    // Web Performance
    {
      title: "Core Web Vitals & Web Performance Optimization",
      description: "Optimize Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and bundle sizes.",
      skillSlug: "web-performance",
      trackId: frontendTrack.id,
      difficulty: "intermediate",
      durationHours: 9,
      provider: "Google Web Dev Guild",
      rating: 4.9
    },

    // SQL Courses
    {
      title: "SQL Zero to Hero: Queries, Joins & Aggregations",
      description: "Learn relational database fundamentals, filtering, grouping, and inner/outer joins with real data.",
      skillSlug: "sql-relational-dbs",
      trackId: dataAnalystTrack.id,
      difficulty: "foundational",
      durationHours: 8,
      provider: "DataCamp",
      rating: 4.8
    },
    {
      title: "Intermediate SQL: Window Functions & Subqueries",
      description: "Master RANK(), DENSE_RANK(), LAG(), LEAD(), partition windows, and Common Table Expressions (CTEs).",
      skillSlug: "sql-relational-dbs",
      trackId: dataAnalystTrack.id,
      difficulty: "intermediate",
      durationHours: 10,
      provider: "DataCamp",
      rating: 4.9
    },
    {
      title: "Advanced SQL Query Optimization & Performance Tuning",
      description: "Analyze query execution plans, indexing strategies, partition pruning, and schema optimization.",
      skillSlug: "sql-relational-dbs",
      trackId: dataAnalystTrack.id,
      difficulty: "advanced",
      durationHours: 12,
      provider: "PostgreSQL Guild",
      rating: 4.9
    },

    // Python for Data
    {
      title: "Python Data Analysis with Pandas & NumPy",
      description: "Data frames, series, filtering, grouping, merging, handling missing values, and exploratory analysis.",
      skillSlug: "python-data",
      trackId: dataAnalystTrack.id,
      difficulty: "foundational",
      durationHours: 10,
      provider: "Skill Setu Academy",
      rating: 4.8
    },
    {
      title: "Data Visualization & Dashboard Storytelling",
      description: "Transform raw metrics into compelling visual narratives using Recharts, Matplotlib, and Seaborn.",
      skillSlug: "data-visualization",
      trackId: dataAnalystTrack.id,
      difficulty: "intermediate",
      durationHours: 8,
      provider: "Skill Setu Academy",
      rating: 4.8
    },

    // Node & Express
    {
      title: "Node.js & Express RESTful API Development",
      description: "Build production-ready REST APIs with robust routing, middleware pipelines, and error handling.",
      skillSlug: "nodejs-express",
      trackId: fullStackAITrack.id,
      difficulty: "foundational",
      durationHours: 9,
      provider: "Backend Guild",
      rating: 4.8
    },
    {
      title: "PostgreSQL with Prisma ORM in Production",
      description: "Design relational schemas, execute database migrations, handle foreign keys, and perform type-safe queries.",
      skillSlug: "postgresql-prisma",
      trackId: fullStackAITrack.id,
      difficulty: "intermediate",
      durationHours: 8,
      provider: "Prisma Official",
      rating: 4.9
    },
    {
      title: "Building Generative AI Applications with Google Gemini",
      description: "Harness Gemini 1.5/2.0 Flash with structured JSON schemas, multimodal prompts, and OCR integrations.",
      skillSlug: "generative-ai-llms",
      trackId: fullStackAITrack.id,
      difficulty: "intermediate",
      durationHours: 10,
      provider: "Google Developer Student Club",
      rating: 5.0
    }
  ];

  for (const c of coursesData) {
    await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        skillId: createdSkills[c.skillSlug].id,
        trackId: c.trackId,
        difficulty: c.difficulty,
        durationHours: c.durationHours,
        provider: c.provider,
        rating: c.rating
      }
    });
  }

  // 6. Seed Baseline Quizzes with Questions
  const reactQuiz = await prisma.quiz.create({
    data: {
      title: "React.js Core Baseline Assessment",
      description: "Diagnostic quiz testing core React principles: components, props, state, and rendering lifecycle.",
      trackId: frontendTrack.id,
      skillId: createdSkills["react-js"].id,
      isBaseline: true,
      timeLimitMinutes: 10
    }
  });

  const reactQuestions = [
    {
      question: "What is the primary reason React uses a Virtual DOM?",
      options: JSON.stringify([
        "To allow direct access to server-side memory",
        "To minimize expensive real DOM mutations via diffing and batching",
        "To replace JavaScript with compiled C++ code",
        "To prevent any CSS from being loaded in the browser"
      ]),
      correct_option: 1,
      explanation: "React maintains a lightweight in-memory representation of the UI (Virtual DOM) and diffs it with the previous snapshot, updating only modified nodes in the real DOM for high rendering performance.",
      difficulty: "foundational"
    },
    {
      question: "Which hook should be used to run side effects like fetching data or setting up subscriptions?",
      options: JSON.stringify([
        "useReducer",
        "useCallback",
        "useEffect",
        "useMemo"
      ]),
      correct_option: 2,
      explanation: "useEffect is specifically designed for side effects, running after render and supporting dependency tracking and optional cleanup callbacks.",
      difficulty: "foundational"
    },
    {
      question: "Why should you never mutate state directly (e.g. state.count = 5) in React?",
      options: JSON.stringify([
        "Direct mutation crashes the JavaScript runtime permanently",
        "React uses object reference equality to detect state changes and schedule re-renders",
        "Direct mutation deletes the browser cache",
        "React does not allow variables with numerical values"
      ]),
      correct_option: 1,
      explanation: "React relies on immutability to determine whether a component needs to re-render via shallow reference comparison (prev !== next). Direct mutation fails this check and leads to missed renders.",
      difficulty: "intermediate"
    },
    {
      question: "What does useMemo return in a functional component?",
      options: JSON.stringify([
        "A memoized callback function",
        "A memoized computed value that only recalculates when dependencies change",
        "A new DOM element reference",
        "An asynchronous promise wrapper"
      ]),
      correct_option: 1,
      explanation: "useMemo caches the result of an expensive calculation between renders, only re-evaluating when one of the specified dependencies has changed.",
      difficulty: "intermediate"
    }
  ];

  for (const q of reactQuestions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: reactQuiz.id,
        question: q.question,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty
      }
    });
  }

  // TypeScript Baseline Quiz
  const tsQuiz = await prisma.quiz.create({
    data: {
      title: "TypeScript Diagnostic Quiz",
      description: "Assess understanding of TypeScript type annotations, interfaces, generics, and union types.",
      trackId: frontendTrack.id,
      skillId: createdSkills["typescript"].id,
      isBaseline: true,
      timeLimitMinutes: 10
    }
  });

  const tsQuestions = [
    {
      question: "What is the difference between 'unknown' and 'any' in TypeScript?",
      options: JSON.stringify([
        "There is no difference; they are exact aliases",
        "'unknown' is type-safe because you must perform type narrowing before performing operations on it",
        "'any' can only hold primitive numbers and booleans",
        "'unknown' causes a compiler error if imported in Node.js"
      ]),
      correct_option: 1,
      explanation: "'unknown' is the type-safe counterpart of 'any'. Anything is assignable to 'unknown', but 'unknown' cannot be operated upon or assigned to another type without narrowing or type assertion.",
      difficulty: "intermediate"
    },
    {
      question: "Which utility type creates a new type by picking a set of keys from an existing type T?",
      options: JSON.stringify([
        "Omit<T, K>",
        "Extract<T, U>",
        "Pick<T, K>",
        "Record<K, T>"
      ]),
      correct_option: 2,
      explanation: "Pick<T, K> constructs a type by picking the set of properties K from type T.",
      difficulty: "foundational"
    },
    {
      question: "What is a TypeScript Generic used for?",
      options: JSON.stringify([
        "To write reusable code that can work across a variety of types while maintaining type safety",
        "To convert TypeScript code into WebAssembly",
        "To allow HTML syntax inside JSON files",
        "To eliminate all runtime error logging"
      ]),
      correct_option: 0,
      explanation: "Generics allow developers to author components and functions that accept type parameters, ensuring reusability without sacrificing static type safety.",
      difficulty: "intermediate"
    }
  ];

  for (const q of tsQuestions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: tsQuiz.id,
        question: q.question,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty
      }
    });
  }

  // SQL Baseline Quiz
  const sqlQuiz = await prisma.quiz.create({
    data: {
      title: "SQL & Relational DBs Baseline Quiz",
      description: "Assess fundamental SQL skills including SELECT, GROUP BY, HAVING, and JOIN semantics.",
      trackId: dataAnalystTrack.id,
      skillId: createdSkills["sql-relational-dbs"].id,
      isBaseline: true,
      timeLimitMinutes: 10
    }
  });

  const sqlQuestions = [
    {
      question: "What is the key difference between WHERE and HAVING clauses in SQL?",
      options: JSON.stringify([
        "HAVING filters rows before aggregation, while WHERE filters after aggregation",
        "WHERE filters rows before aggregation, while HAVING filters grouped results after aggregation",
        "WHERE can only be used with primary keys",
        "HAVING is only valid in NoSQL databases"
      ]),
      correct_option: 1,
      explanation: "The WHERE clause filters individual rows prior to GROUP BY aggregation, whereas the HAVING clause filters the aggregated metric results after grouping.",
      difficulty: "foundational"
    },
    {
      question: "Which JOIN returns all rows from the left table and matched rows from the right table?",
      options: JSON.stringify([
        "INNER JOIN",
        "RIGHT JOIN",
        "LEFT JOIN (or LEFT OUTER JOIN)",
        "CROSS JOIN"
      ]),
      correct_option: 2,
      explanation: "LEFT JOIN preserves every record from the left table; if no match exists in the right table, NULL values are populated for the right table's columns.",
      difficulty: "foundational"
    }
  ];

  for (const q of sqlQuestions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: sqlQuiz.id,
        question: q.question,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty: q.difficulty
      }
    });
  }

  // 7. Seed Demo Accounts
  // Learner 1: Active in Frontend Track with initial self-ratings
  const demoLearner = await prisma.user.create({
    data: {
      email: "learner@skillsetu.ai",
      password: hashedPassword,
      name: "Aaditya Sharma",
      role: "learner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      targetTrackId: frontendTrack.id,
      hasOnboarded: true
    }
  });

  // Create SkillProfile for learner (demonstrating gaps)
  // React: Level 2 (Required: 4, Gap: 2 - Foundational)
  await prisma.skillProfile.create({
    data: {
      userId: demoLearner.id,
      skillId: createdSkills["react-js"].id,
      level: 2,
      source: "self-rated"
    }
  });

  // TypeScript: Level 1 (Required: 4, Gap: 3 - Foundational)
  await prisma.skillProfile.create({
    data: {
      userId: demoLearner.id,
      skillId: createdSkills["typescript"].id,
      level: 1,
      source: "self-rated"
    }
  });

  // Tailwind: Level 3 (Required: 3, Gap: 0 - Met)
  await prisma.skillProfile.create({
    data: {
      userId: demoLearner.id,
      skillId: createdSkills["tailwind-css"].id,
      level: 3,
      source: "quiz"
    }
  });

  // State Management: Level 2 (Required: 3, Gap: 1 - Foundational)
  await prisma.skillProfile.create({
    data: {
      userId: demoLearner.id,
      skillId: createdSkills["state-management"].id,
      level: 2,
      source: "self-rated"
    }
  });

  // Web Performance: Level 1 (Required: 3, Gap: 2 - Foundational)
  await prisma.skillProfile.create({
    data: {
      userId: demoLearner.id,
      skillId: createdSkills["web-performance"].id,
      level: 1,
      source: "self-rated"
    }
  });

  // Create a past QuizAttempt for learner
  await prisma.quizAttempt.create({
    data: {
      userId: demoLearner.id,
      quizId: reactQuiz.id,
      score: 3,
      totalQuestions: 4,
      percentage: 75.0,
      passed: true,
      answersJson: JSON.stringify([
        { questionId: "1", selectedOption: 1, isCorrect: true, explanation: "Correctly recognized Virtual DOM diffing." },
        { questionId: "2", selectedOption: 2, isCorrect: true, explanation: "Correctly identified useEffect for side-effects." },
        { questionId: "3", selectedOption: 1, isCorrect: true, explanation: "Correctly understood immutability requirements." },
        { questionId: "4", selectedOption: 0, isCorrect: false, explanation: "Confused useMemo with useCallback." }
      ])
    }
  });

  // Admin Account
  const demoAdmin = await prisma.user.create({
    data: {
      email: "admin@skillsetu.ai",
      password: hashedPassword,
      name: "Dr. Sunita Rao (Director)",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      hasOnboarded: true
    }
  });

  // Learner 2: Data Analyst
  const demoAnalyst = await prisma.user.create({
    data: {
      email: "analyst@skillsetu.ai",
      password: hashedPassword,
      name: "Rohan Patel",
      role: "learner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      targetTrackId: dataAnalystTrack.id,
      hasOnboarded: true
    }
  });

  await prisma.skillProfile.create({
    data: {
      userId: demoAnalyst.id,
      skillId: createdSkills["sql-relational-dbs"].id,
      level: 3,
      source: "quiz"
    }
  });
  await prisma.skillProfile.create({
    data: {
      userId: demoAnalyst.id,
      skillId: createdSkills["python-data"].id,
      level: 2,
      source: "self-rated"
    }
  });

  console.log("✅ Skill Setu Seed Completed Successfully!");
  console.log("👤 Demo Accounts Created:");
  console.log("   - Learner: learner@skillsetu.ai / Password123!");
  console.log("   - Admin:   admin@skillsetu.ai / Password123!");
  console.log("   - Analyst: analyst@skillsetu.ai / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
