export function getCoursesData(trackIds) {
  const { trackWebId, trackDataId, trackCloudId, trackCSId } = trackIds;

  return [
    // Web Courses
    {
      title: "Modern JavaScript Deep Dive: ES6 to Asynchronous Patterns",
      description: "Master closures, prototypal inheritance, Promises, event loop mechanics, and functional paradigms.",
      trackId: trackWebId,
      durationHours: 14,
      level: "Beginner",
      rating: 4.9,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "javascript-es6", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "React 19 & Next-Gen Component Architecture",
      description: "Build reactive, accessible frontends using server components, custom hooks, and modern client state patterns.",
      trackId: trackWebId,
      durationHours: 20,
      level: "Intermediate",
      rating: 4.9,
      prerequisites: JSON.stringify(["Modern JavaScript Deep Dive: ES6 to Asynchronous Patterns"]),
      skills: [{ slug: "react-state", level: 3 }, { slug: "javascript-es6", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Tailwind CSS & Modern Design Systems",
      description: "Craft pixel-perfect, responsive, dark-mode-ready UI components with Tailwind CSS utility classes.",
      trackId: trackWebId,
      durationHours: 8,
      level: "Beginner",
      rating: 4.7,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "tailwind-css", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Production Node.js & Express RESTful Microservices",
      description: "Design modular backend APIs with robust routing, JWT authentication, rate limiting, and clean error handling.",
      trackId: trackWebId,
      durationHours: 18,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify(["Modern JavaScript Deep Dive: ES6 to Asynchronous Patterns"]),
      skills: [{ slug: "node-express", level: 3 }, { slug: "rest-api-security", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Relational Database Engineering with PostgreSQL & Prisma",
      description: "Data modeling, foreign key constraints, indexes, query optimization, migrations, and ORM integration.",
      trackId: trackWebId,
      durationHours: 16,
      level: "Intermediate",
      rating: 4.9,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "sql-databases", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "TypeScript Enterprise Mastery",
      description: "Type safety, conditional types, utility types, declaration files, and large-scale architectural refactoring.",
      trackId: trackWebId,
      durationHours: 12,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify(["Modern JavaScript Deep Dive: ES6 to Asynchronous Patterns"]),
      skills: [{ slug: "typescript", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc76800c735?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Advanced Web Security & API Hardening",
      description: "Defend against OWASP Top 10 vulnerabilities: XSS, CSRF, SQL injection, CORS misconfigs, and token hijacking.",
      trackId: trackWebId,
      durationHours: 10,
      level: "Advanced",
      rating: 4.9,
      prerequisites: JSON.stringify(["Production Node.js & Express RESTful Microservices"]),
      skills: [{ slug: "rest-api-security", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60"
    },

    // Data Science Courses
    {
      title: "Python for Data Analysis & Exploratory Modeling",
      description: "Pandas dataframe wrangling, NumPy vectorized computing, missing data imputation, and statistical summaries.",
      trackId: trackDataId,
      durationHours: 15,
      level: "Beginner",
      rating: 4.9,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "python-data", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Applied Probability & Statistical Inference for AI",
      description: "Distributions, Central Limit Theorem, hypothesis testing, p-values, A/B testing, and Bayesian analysis.",
      trackId: trackDataId,
      durationHours: 14,
      level: "Beginner",
      rating: 4.8,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "applied-statistics", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Practical Machine Learning with Scikit-Learn",
      description: "Linear & logistic regression, decision trees, random forests, SVMs, clustering, and hyperparameter tuning.",
      trackId: trackDataId,
      durationHours: 22,
      level: "Intermediate",
      rating: 4.9,
      prerequisites: JSON.stringify(["Python for Data Analysis & Exploratory Modeling"]),
      skills: [{ slug: "machine-learning", level: 3 }, { slug: "feature-engineering", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Deep Learning Foundations with PyTorch",
      description: "Build neural network architectures, custom loss functions, backprop, CNNs for computer vision, and RNNs.",
      trackId: trackDataId,
      durationHours: 25,
      level: "Advanced",
      rating: 4.9,
      prerequisites: JSON.stringify(["Practical Machine Learning with Scikit-Learn"]),
      skills: [{ slug: "deep-learning-pytorch", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Modern NLP: Transformers & Large Language Models",
      description: "Tokenization, self-attention, Hugging Face transformers, fine-tuning BERT/RoBERTa, and LLM prompting.",
      trackId: trackDataId,
      durationHours: 18,
      level: "Advanced",
      rating: 4.8,
      prerequisites: JSON.stringify(["Deep Learning Foundations with PyTorch"]),
      skills: [{ slug: "nlp-foundations", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Data Visualization & Executive Dashboards",
      description: "Communicate data stories with Matplotlib, Seaborn, interactive Plotly visualizations, and narrative structure.",
      trackId: trackDataId,
      durationHours: 9,
      level: "Beginner",
      rating: 4.7,
      prerequisites: JSON.stringify(["Python for Data Analysis & Exploratory Modeling"]),
      skills: [{ slug: "data-visualization", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60"
    },

    // Cloud & DevOps Courses
    {
      title: "Linux Command Line & Shell Scripting Mastery",
      description: "Bash automation, file permissions, systemd, process isolation, Cron jobs, and diagnostic utilities.",
      trackId: trackCloudId,
      durationHours: 12,
      level: "Beginner",
      rating: 4.9,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "linux-sysadmin", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Docker Bootcamp: Containers from Scratch to Production",
      description: "Container lifecycles, Docker Compose multi-container environments, layer caching, and microservices.",
      trackId: trackCloudId,
      durationHours: 15,
      level: "Beginner",
      rating: 4.9,
      prerequisites: JSON.stringify(["Linux Command Line & Shell Scripting Mastery"]),
      skills: [{ slug: "docker", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Kubernetes in Action: Production Cluster Management",
      description: "Deployments, Services, ConfigMaps, PersistentVolumes, Ingress controllers, Helm charts, and RBAC.",
      trackId: trackCloudId,
      durationHours: 24,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify(["Docker Bootcamp: Containers from Scratch to Production"]),
      skills: [{ slug: "kubernetes", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "CI/CD Pipeline Automation with GitHub Actions",
      description: "Build, test, lint, and deploy workflows, matrix builds, environment secrets, and automated releases.",
      trackId: trackCloudId,
      durationHours: 10,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify(["Docker Bootcamp: Containers from Scratch to Production"]),
      skills: [{ slug: "ci-cd-pipelines", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Infrastructure as Code with Terraform & Cloud Architecture",
      description: "State management, modular cloud architecture, variables, outputs, and automated provisioning on AWS.",
      trackId: trackCloudId,
      durationHours: 16,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify(["Linux Command Line & Shell Scripting Mastery"]),
      skills: [{ slug: "terraform", level: 3 }, { slug: "cloud-architecture", level: 3 }],
      thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=60"
    },

    // Core CS Courses
    {
      title: "Data Structures Mastery: Arrays, Trees & Graphs",
      description: "Rigorous implementation of doubly linked lists, binary heaps, AVL trees, graphs, and hash tables.",
      trackId: trackCSId,
      durationHours: 25,
      level: "Beginner",
      rating: 4.9,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "dsa-structures", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Algorithmic Problem Solving & Dynamic Programming",
      description: "Two-pointer techniques, sliding windows, recursion, memoization, tabular DP, and topological sorts.",
      trackId: trackCSId,
      durationHours: 30,
      level: "Intermediate",
      rating: 4.9,
      prerequisites: JSON.stringify(["Data Structures Mastery: Arrays, Trees & Graphs"]),
      skills: [{ slug: "dsa-algorithms", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Operating Systems Internals & Concurrency",
      description: "Process scheduling, thread synchronization, mutexes, condition variables, virtual memory, and page faults.",
      trackId: trackCSId,
      durationHours: 20,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "operating-systems", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Computer Networking from Sockets to Protocols",
      description: "Packet dissection, TCP sliding window, congestion control, HTTP/3, TLS encryption, and DNS resolution.",
      trackId: trackCSId,
      durationHours: 16,
      level: "Intermediate",
      rating: 4.8,
      prerequisites: JSON.stringify([]),
      skills: [{ slug: "computer-networks", level: 4 }],
      thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=60"
    }
  ];
}
