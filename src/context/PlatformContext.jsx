import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MOCK_PROFILES,
  COMPETENCIES,
  TARGET_ROLES,
  IGOT_COURSES,
  QUESTION_BANK,
  MOCK_DOCUMENTS,
  MOCK_ORG_ANALYTICS,
} from "../data/mockData.js";

const PlatformContext = createContext();

export function PlatformProvider({ children }) {
  // SSO Role: 'learner' | 'trainer' | 'admin'
  const [role, setRole] = useState("learner");

  // Navigation Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Active User Profile (In-Memory Only, No localStorage)
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [activeUserId, setActiveUserId] = useState("user-001");
  const currentUser = profiles.find((p) => p.id === activeUserId) || profiles[0];

  // Dynamic Competency Matrix for the Active User (updates in memory upon quiz/course completion)
  const [userCompetencies, setUserCompetencies] = useState(() => {
    return { ...currentUser.currentCompetencies };
  });

  // Keep userCompetencies synced when activeUserId changes
  useEffect(() => {
    const user = profiles.find((p) => p.id === activeUserId);
    if (user) {
      setUserCompetencies({ ...user.currentCompetencies });
    }
  }, [activeUserId]);

  // Target Role for Skill Gap Analysis
  const [targetRoleId, setTargetRoleId] = useState("role-sso");
  const currentTargetRole = TARGET_ROLES.find((r) => r.id === targetRoleId) || TARGET_ROLES[0];

  // Enrolled Courses in-memory state: { [courseId]: { progress: number, enrolledAt: string, status: 'enrolled'|'in-progress'|'completed' } }
  const [enrolledCourses, setEnrolledCourses] = useState({
    "igot-101": { progress: 65, enrolledAt: "2026-08-15", status: "in-progress" },
    "igot-104": { progress: 40, enrolledAt: "2026-08-20", status: "in-progress" },
    "igot-113": { progress: 100, enrolledAt: "2026-07-10", status: "completed" },
  });

  // Accessibility Controls
  const [fontSize, setFontSize] = useState("base"); // 'sm' | 'base' | 'lg'
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("EN"); // 'EN' | 'HI'

  // Apply high-contrast & font-size class to document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove("font-size-sm", "font-size-base", "font-size-lg");
    document.body.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  // Toast Notification System (In-Memory)
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // AI Assessment Generator State (Trainer Studio)
  const [uploadedDocs, setUploadedDocs] = useState(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(MOCK_DOCUMENTS[0]);
  const [generatingStep, setGeneratingStep] = useState(0); // 0=idle, 1=Extract, 2=Segment, 3=Generate, 4=Validate, 5=Ready
  const [generatedQuestions, setGeneratedQuestions] = useState(QUESTION_BANK.slice(0, 6));
  const [publishedAssessments, setPublishedAssessments] = useState([
    {
      id: "test-live-1",
      title: "MoSPI Official Statistics & Survey Sampling Assessment 2026",
      topic: "Survey Design & Sampling / National Accounts",
      competencyIds: ["comp-stat-1", "comp-stat-2"],
      timeLimitMinutes: 15,
      questions: QUESTION_BANK.slice(0, 5),
      passingScore: 60,
      attemptsCount: 142,
    },
    {
      id: "test-live-2",
      title: "Digital Personal Data Protection (DPDP) Act 2023 Compliance Test",
      topic: "Digital Governance & Privacy",
      competencyIds: ["comp-gov-1"],
      timeLimitMinutes: 10,
      questions: QUESTION_BANK.filter((q) => q.competencyId === "comp-gov-1" || q.competencyId === "comp-tech-3"),
      passingScore: 60,
      attemptsCount: 389,
    },
    {
      id: "test-live-3",
      title: "Python for Official Statistics: Practical Code Diagnostic",
      topic: "Technical & Automated Pipelines",
      competencyIds: ["comp-tech-1", "comp-tech-3"],
      timeLimitMinutes: 15,
      questions: QUESTION_BANK.filter((q) => q.competencyId.startsWith("comp-tech")),
      passingScore: 60,
      attemptsCount: 215,
    }
  ]);

  // Quiz Taking Modal State
  const [activeQuizModal, setActiveQuizModal] = useState({
    isOpen: false,
    assessment: null,
  });

  // Animated Competency Level Upgrade Modal
  const [levelUpModal, setLevelUpModal] = useState({
    isOpen: false,
    skillName: "",
    oldLevel: 2,
    newLevel: 3,
    competencyCode: "",
  });

  // AI Chat Assistant State (Setu Saathi)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "नमस्ते! I am Setu Saathi, your AI Statistical Competency Guide. How may I assist your learning journey in MoSPI/NSSTA today?",
      timestamp: "Just now",
      suggestions: [
        "Why was Python for Official Statistics recommended to me?",
        "What are my critical skill gaps for promotion to Senior Statistical Officer?",
        "How is Jevons Formula used in CPI compilation?",
        "Explain the statistical exemption under DPDP Act 2023."
      ]
    }
  ]);

  // ACTIONS

  // Switch Active User
  const switchUser = (userId) => {
    setActiveUserId(userId);
    const user = profiles.find((p) => p.id === userId);
    if (user) {
      addToast(
        "User Profile Switched",
        `Now viewing as ${user.name} (${user.role} - ${user.cadre})`,
        "success"
      );
    }
  };

  // Switch Role (SSO Mock)
  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") {
      setActiveTab("admin");
      addToast("Role Switched to Admin", "Switched to MoSPI / NSSTA Leadership Admin Console.", "info");
    } else if (newRole === "trainer") {
      setActiveTab("assessments");
      addToast("Role Switched to Trainer", "Switched to NSSTA Faculty & Assessment Authoring Studio.", "info");
    } else {
      setActiveTab("dashboard");
      addToast("Role Switched to Learner", "Switched to Official Statistical Officer Learner View.", "info");
    }
  };

  // Course Enrollment
  const enrollInCourse = (courseId) => {
    const course = IGOT_COURSES.find((c) => c.id === courseId);
    if (!course) return;

    if (enrolledCourses[courseId]) {
      addToast("Already Enrolled", `You are already enrolled in "${course.title}".`, "info");
      return;
    }

    setEnrolledCourses((prev) => ({
      ...prev,
      [courseId]: { progress: 0, enrolledAt: new Date().toISOString().split("T")[0], status: "in-progress" },
    }));

    addToast(
      "Enrolled in iGOT Karmayogi",
      `Successfully enrolled in "${course.title}". Added to your Active Learning Roadmap.`,
      "success"
    );
  };

  // Update Course Progress
  const updateCourseProgress = (courseId, newProgress) => {
    setEnrolledCourses((prev) => {
      const existing = prev[courseId] || { enrolledAt: new Date().toISOString().split("T")[0] };
      const status = newProgress >= 100 ? "completed" : "in-progress";
      return {
        ...prev,
        [courseId]: { ...existing, progress: Math.min(100, newProgress), status },
      };
    });
  };

  // Rule-based Competency Profile Generator
  const generateCompetencyProfile = (formInput) => {
    // Simulates deterministic AI profiling based on designation, cadre, qualifications, experience
    const newComp = { ...userCompetencies };
    const exp = parseFloat(formInput.experienceYears) || 3;

    if (formInput.designation.includes("Senior") || exp >= 5) {
      newComp["comp-stat-1"] = Math.max(newComp["comp-stat-1"] || 1, 3);
      newComp["comp-stat-2"] = Math.max(newComp["comp-stat-2"] || 1, 3);
      newComp["comp-beh-1"] = Math.max(newComp["comp-beh-1"] || 1, 4);
    }
    if (formInput.specialization?.includes("Accounts") || formInput.department?.includes("NAD")) {
      newComp["comp-stat-2"] = Math.max(newComp["comp-stat-2"] || 1, 4);
    }
    if (formInput.specialization?.includes("Price") || formInput.department?.includes("Price")) {
      newComp["comp-stat-3"] = Math.max(newComp["comp-stat-3"] || 1, 4);
    }
    if (formInput.qualifications?.toLowerCase().includes("python") || formInput.qualifications?.toLowerCase().includes("tech")) {
      newComp["comp-tech-1"] = Math.max(newComp["comp-tech-1"] || 1, 3);
      newComp["comp-tech-3"] = Math.max(newComp["comp-tech-3"] || 1, 3);
    }

    setUserCompetencies(newComp);

    // Update in profiles array in-memory
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeUserId
          ? {
              ...p,
              role: formInput.designation || p.role,
              cadre: formInput.cadre || p.cadre,
              department: formInput.department || p.department,
              experienceYears: exp,
              qualification: formInput.qualifications || p.qualification,
              currentCompetencies: newComp,
            }
          : p
      )
    );

    addToast(
      "AI Competency Profile Formulated",
      "Skill matrix regenerated from cadre parameters and service record.",
      "success"
    );
  };

  // AI Assessment Generator Simulation (Progress Stepper)
  const triggerAIGeneration = (doc) => {
    setSelectedDoc(doc);
    setGeneratingStep(1);

    const steps = [
      { step: 1, delay: 900, msg: "Extracting structural sections from document..." },
      { step: 2, delay: 1800, msg: "Performing semantic segmentation and learning objective mapping..." },
      { step: 3, delay: 2800, msg: "Drafting psychometric multiple-choice items and distractors..." },
      { step: 4, delay: 3900, msg: "Evaluating difficulty discrimination against MoSPI syllabus..." },
      { step: 5, delay: 4800, msg: "Assessment items ready for NSSTA Trainer Review!" },
    ];

    steps.forEach(({ step, delay, msg }) => {
      setTimeout(() => {
        setGeneratingStep(step);
        if (step === 5) {
          // Add questions based on doc
          addToast("AI Question Generation Complete", `${doc.suggestedQuestionsCount} questions ready for trainer verification.`, "success");
        }
      }, delay);
    });
  };

  // Trainer Question Approvals & Edits
  const approveQuestion = (qId) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, approved: true } : q))
    );
    addToast("Item Approved", "Question validated and approved for publishing.", "info");
  };

  const rejectQuestion = (qId) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== qId));
    addToast("Item Rejected", "Question discarded from generation pool.", "warning");
  };

  const editQuestion = (qId, updatedFields) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...updatedFields } : q))
    );
    addToast("Item Updated", "Question edits saved successfully.", "info");
  };

  const publishGeneratedQuiz = (quizTitle) => {
    const approved = generatedQuestions.filter((q) => q.approved !== false);
    if (approved.length === 0) {
      addToast("Cannot Publish", "Please approve at least one question before publishing.", "warning");
      return;
    }

    const newAssessment = {
      id: "test-user-" + Date.now(),
      title: quizTitle || `AI Assessment: ${selectedDoc.domain}`,
      topic: selectedDoc.domain,
      competencyIds: ["comp-stat-1", "comp-stat-2"],
      timeLimitMinutes: 12,
      questions: approved,
      passingScore: 60,
      attemptsCount: 0,
    };

    setPublishedAssessments((prev) => [newAssessment, ...prev]);
    setGeneratingStep(0);
    addToast(
      "Assessment Published to iGOT Hub",
      `"${newAssessment.title}" is now available for all MoSPI officials to take.`,
      "success"
    );
  };

  // Complete Assessment & Upgrade Competency Score
  const completeQuiz = (assessment, scorePercent, scoreCount, totalQuestions) => {
    const passed = scorePercent >= assessment.passingScore;

    if (passed && assessment.competencyIds?.length > 0) {
      const primaryCompId = assessment.competencyIds[0];
      const compInfo = COMPETENCIES.find((c) => c.id === primaryCompId);
      const currentLevel = userCompetencies[primaryCompId] || 1;

      if (currentLevel < 5) {
        const nextLevel = currentLevel + 1;
        setUserCompetencies((prev) => ({
          ...prev,
          [primaryCompId]: nextLevel,
        }));

        // Trigger celebratory upgrade modal!
        setLevelUpModal({
          isOpen: true,
          skillName: compInfo?.name || "Official Statistical Methodology",
          oldLevel: currentLevel,
          newLevel: nextLevel,
          competencyCode: compInfo?.code || "STAT-01",
        });

        addToast(
          "Competency Score Upgraded!",
          `Congratulations! Your proficiency in ${compInfo?.name} increased from Level ${currentLevel} to Level ${nextLevel}.`,
          "success"
        );
      }
    } else {
      addToast(
        "Assessment Completed",
        `You scored ${scoreCount}/${totalQuestions} (${scorePercent}%). Passing score is ${assessment.passingScore}%. Review explanations below.`,
        passed ? "success" : "info"
      );
    }
  };

  // Rule-Based AI Chat Assistant Responses
  const sendChatMessage = (userText) => {
    const newMsg = { sender: "user", text: userText, timestamp: "Just now" };
    setChatMessages((prev) => [...prev, newMsg]);

    const lower = userText.toLowerCase();
    let reply = "";
    let suggestions = [];

    if (lower.includes("why") && (lower.includes("recommend") || lower.includes("course") || lower.includes("python"))) {
      reply = `Based on your profile as ${currentUser.role} in ${currentUser.department}, your target role (${currentTargetRole.title}) requires Python for Official Statistics at Level 3. Your current level is 2. Completing "Python for Official Statistics (MOSPI-TECH-201)" directly closes this 1-level gap and equips you with automated survey microdata wrangling skills.`;
      suggestions = ["What is the next course on my roadmap?", "Show my largest skill gaps"];
    } else if (lower.includes("gap") || lower.includes("promotion") || lower.includes("sso") || lower.includes("next")) {
      reply = `To transition from ${currentUser.role} to ${currentTargetRole.title}, you have identified gaps in: 1) Python for Official Statistics (Gap: -1), 2) National Accounts & GDP (Gap: -1), and 3) Data Privacy & DPDP Act 2023 (Gap: -1). I recommend starting with the 24-hour Advanced Survey Sampling course or DPDP Compliance module.`;
      suggestions = ["Enroll me in DPDP Act 2023", "Take the Survey Sampling diagnostic quiz"];
    } else if (lower.includes("jevons") || lower.includes("cpi") || lower.includes("price")) {
      reply = `In MoSPI Price Statistics, the Jevons formula compiles the unweighted geometric mean of price relatives: J = prod(P_t / P_0)^(1/N). It satisfies the time-reversal and transitivity tests, preventing the upward substitution bias inherent in the arithmetic Carli index.`;
      suggestions = ["How is WPI different from CPI?", "Recommend courses for Price Statistics"];
    } else if (lower.includes("dpdp") || lower.includes("privacy")) {
      reply = `Section 17 of India's Digital Personal Data Protection (DPDP) Act 2023 provides exemptions for processing personal data for statistical and scientific research purposes, provided the data is not used to make decisions affecting the specific data principal and appropriate statistical disclosure controls (k-anonymity, suppression) are enforced.`;
      suggestions = ["Take the DPDP Act compliance quiz", "What is statistical disclosure control?"];
    } else if (lower.includes("mistake") || lower.includes("quiz") || lower.includes("wrong")) {
      reply = `Looking at your recent attempts: In Question 1 regarding First Stage Units (FSUs) in urban areas under PLFS, remember that MoSPI uses Urban Frame Survey (UFS) blocks as FSUs in urban areas, not municipality wards or individual households. In rural areas, Census villages serve as the FSUs.`;
      suggestions = ["Retake the PLFS quiz", "Show me the PLFS course on iGOT"];
    } else {
      reply = `Under MoSPI/NSSTA competency frameworks, each role is calibrated across Statistical, Technical, Digital Governance, and Behavioural domains. You can use the Skill-Gap Engine to visualize radar benchmarks, or browse the iGOT Course Catalogue for NSSTA-accredited modules.`;
      suggestions = ["What are the 4 MoSPI competency domains?", "Show org-wide analytics"];
    }

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
          timestamp: "Just now",
          suggestions: suggestions.length ? suggestions : undefined,
        },
      ]);
    }, 600);
  };

  return (
    <PlatformContext.Provider
      value={{
        role,
        switchRole,
        activeTab,
        setActiveTab,
        profiles,
        currentUser,
        activeUserId,
        switchUser,
        userCompetencies,
        targetRoleId,
        setTargetRoleId,
        currentTargetRole,
        enrolledCourses,
        enrollInCourse,
        updateCourseProgress,
        generateCompetencyProfile,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        language,
        setLanguage,
        toasts,
        addToast,
        removeToast,
        uploadedDocs,
        selectedDoc,
        generatingStep,
        triggerAIGeneration,
        generatedQuestions,
        approveQuestion,
        rejectQuestion,
        editQuestion,
        publishedAssessments,
        publishGeneratedQuiz,
        activeQuizModal,
        setActiveQuizModal,
        levelUpModal,
        setLevelUpModal,
        completeQuiz,
        chatOpen,
        setChatOpen,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
