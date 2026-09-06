import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MOCK_PROFILES,
  COMPETENCIES,
  TARGET_ROLES,
  IGOT_COURSES,
  QUESTION_BANK,
  MOCK_DOCUMENTS,
  MOCK_ORG_ANALYTICS,
  TPAC_PROGRAMMES,
  VIRTUAL_LABS,
  MOCK_DISCUSSIONS,
  MOCK_OFFICIALS_DIRECTORY,
  MOCK_EVENTS,
} from "../data/mockData.js";

const PlatformContext = createContext();

const INITIAL_ACCOUNTS = {
  "jso.aadeesh@mospi.gov.in": {
    id: "user-001",
    email: "jso.aadeesh@mospi.gov.in",
    password: "Learner@123",
    role: "learner",
    hasOnboarded: false,
    name: "Aadeesh Sharma"
  },
  "faculty.nssta@mospi.gov.in": {
    id: "user-trainer",
    email: "faculty.nssta@mospi.gov.in",
    password: "Trainer@123",
    role: "trainer",
    hasOnboarded: false,
    name: "Prof. S. R. Mukhopadhyay"
  },
  "admin.mospi@mospi.gov.in": {
    id: "user-admin",
    email: "admin.mospi@mospi.gov.in",
    password: "Admin@123",
    role: "admin",
    hasOnboarded: true,
    name: "Dr. Arvind Subramanian, ISS"
  }
};

export function PlatformProvider({ children }) {
  // Authentication & Session State (Strictly In-Memory, No localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [currentAccountKey, setCurrentAccountKey] = useState(null);
  const [role, setRole] = useState("learner");

  // Selected official for Admin read-only drill-down modal
  const [selectedOfficialForDrilldown, setSelectedOfficialForDrilldown] = useState(null);

  // iGOT Six Functional Hubs Architecture
  const [activeHub, setActiveHub] = useState("learn");
  const [hubSubTab, setHubSubTab] = useState("roadmap"); // Sub-tab within hub

  const setActiveTab = (tab) => {
    if (tab === "skillgap" || tab === "competency") {
      setActiveHub("competency");
      setHubSubTab("skillgap");
    } else if (tab === "dashboard" || tab === "learn") {
      setActiveHub("learn");
      setHubSubTab("roadmap");
    } else if (tab === "courses") {
      setActiveHub("learn");
      setHubSubTab("catalogue");
    } else if (tab === "assessments") {
      setActiveHub("learn");
      setHubSubTab("adaptive");
    } else {
      setActiveHub(tab);
    }
  };

  // Active User Profile (In-Memory Only, No localStorage)
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [activeUserId, setActiveUserId] = useState("user-001");
  const currentUser = profiles.find((p) => p.id === activeUserId) || profiles[0];

  // Dynamic Competency Matrix for the Active User (updates in memory upon quiz/course completion)
  const [userCompetencies, setUserCompetencies] = useState(() => {
    return { ...currentUser.currentCompetencies };
  });

  // Keep userCompetencies synced when active user changes
  useEffect(() => {
    const user = profiles.find((p) => p.id === activeUserId);
    if (user && user.currentCompetencies) {
      setUserCompetencies({ ...user.currentCompetencies });
    }
  }, [activeUserId]);

  // Target Role for Skill Gap Analysis
  const [targetRoleId, setTargetRoleId] = useState("role-sso");
  const currentTargetRole = TARGET_ROLES.find((r) => r.id === targetRoleId) || TARGET_ROLES[0];

  // Enrolled Courses in-memory state: { [courseId]: { progress: number, enrolledAt: string, status: 'in-progress'|'completed' } }
  const [enrolledCourses, setEnrolledCourses] = useState({
    "igot-101": { progress: 65, enrolledAt: "2026-08-15", status: "in-progress" },
    "igot-104": { progress: 40, enrolledAt: "2026-08-20", status: "in-progress" },
    "igot-113": { progress: 100, enrolledAt: "2026-07-10", status: "completed" },
  });

  // NSSTA TPAC Training Programmes Nominations: { [tpacId]: { nominatedAt: string, status: 'Nominated' } }
  const [tpacNominations, setTpacNominations] = useState({
    "tpac-02": { nominatedAt: "2026-08-25", status: "Nominated" }
  });

  // Peer Discussions State
  const [discussions, setDiscussions] = useState(MOCK_DISCUSSIONS);

  // Officials Network & Connections State
  const [myNetwork, setMyNetwork] = useState(new Set(["off-002", "off-004"]));

  // Academic Events Calendar State
  const [eventsList, setEventsList] = useState(
    MOCK_EVENTS.map((e) => (e.id === "evt-01" ? { ...e, isRSVP: true } : { ...e, isRSVP: false }))
  );

  // Virtual Labs State
  const [activeLabId, setActiveLabId] = useState(VIRTUAL_LABS[0].id);
  const [labCode, setLabCode] = useState(VIRTUAL_LABS[0].starterCode);
  const [labConsoleOutput, setLabConsoleOutput] = useState(VIRTUAL_LABS[0].cannedOutput);
  const [isLabRunning, setIsLabRunning] = useState(false);

  // In-Memory Audit & Compliance Log (Sensitive actions tracking)
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "aud-001",
      timestamp: "2026-09-06 18:45:10",
      actor: "Aadeesh Sharma (KY-MOSPI-2024-8841)",
      role: "Learner",
      action: "USER_LOGIN_PARICHAY",
      details: "Authenticated via Jan Parichay National SSO Gateway (2FA Verified)",
      ipAddress: "10.14.88.21"
    },
    {
      id: "aud-002",
      timestamp: "2026-09-06 18:50:22",
      actor: "Aadeesh Sharma (KY-MOSPI-2024-8841)",
      role: "Learner",
      action: "COURSE_ENROLLMENT_IGOT",
      details: "Enrolled in MOSPI-STAT-101: Advanced Survey Sampling Techniques",
      ipAddress: "10.14.88.21"
    },
    {
      id: "aud-003",
      timestamp: "2026-09-06 19:12:05",
      actor: "Dr. Vikramaditya Sengupta (KY-MOSPI-2012-0054)",
      role: "Trainer",
      action: "ASSESSMENT_PUBLISHED",
      details: "Published test-live-1: MoSPI Official Statistics & Survey Sampling Assessment",
      ipAddress: "10.14.92.104"
    }
  ]);

  const logAuditAction = (action, details, actorOverride = null, roleOverride = null) => {
    const actorName = actorOverride || `${currentUser.name} (${currentUser.karmayogiId})`;
    const actorRole = roleOverride || role.toUpperCase();
    const newLog = {
      id: "aud-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: actorName,
      role: actorRole,
      action,
      details,
      ipAddress: "10.14.88." + (Math.floor(Math.random() * 80) + 20)
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Accessibility Controls
  const [fontSize, setFontSize] = useState("base"); // 'sm' | 'base' | 'lg'
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("EN"); // 'EN' | 'HI'

  // Parichay SSO Modal & PS Compliance Matrix Modal
  const [parichayModalOpen, setParichayModalOpen] = useState(false);
  const [psMatrixModalOpen, setPsMatrixModalOpen] = useState(false);

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
  const [generatingStep, setGeneratingStep] = useState(0);
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
      author: "NSSTA Faculty"
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
      author: "Legal & Compliance Wing"
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
      author: "AI Center of Excellence"
    }
  ]);

  // Quiz Taking Modal State with Adaptive Branching support
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
      text: "नमस्ते! I am Setu Saathi, your AI Statistical Competency Guide on iGOT Karmayogi. How may I assist your learning journey in MoSPI / NSSTA today?",
      timestamp: "Just now",
      suggestions: [
        "Why was Python for Official Statistics recommended to me?",
        "What are my critical skill gaps for promotion to Senior Statistical Officer?",
        "Show available NSSTA TPAC Training Programmes",
        "How does the Adaptive Assessment engine adjust difficulty?"
      ]
    }
  ]);

  // Authentication & Session Management
  const login = (emailOrId, password) => {
    const cleanId = (emailOrId || "").trim().toLowerCase();
    const matchedKey = Object.keys(accounts).find(
      (k) => k.toLowerCase() === cleanId || accounts[k].id.toLowerCase() === cleanId
    );

    if (!matchedKey) {
      logAuditAction("LOGIN_FAILED", `Failed authentication attempt for ID: ${emailOrId}`, emailOrId, "ANONYMOUS");
      return { success: false, error: "Invalid Karmayogi ID or Password. Please try again." };
    }

    const account = accounts[matchedKey];
    if (account.password !== password) {
      logAuditAction("LOGIN_FAILED", `Incorrect password for ID: ${emailOrId}`, emailOrId, account.role.toUpperCase());
      return { success: false, error: "Invalid Karmayogi ID or Password. Please try again." };
    }

    setIsAuthenticated(true);
    setCurrentAccountKey(matchedKey);
    setRole(account.role);
    setActiveUserId(account.id);

    if (account.role === "admin") {
      setActiveHub("admin-analytics");
    } else if (account.role === "trainer") {
      setActiveHub("trainer-studio");
    } else {
      setActiveHub("learn");
      setHubSubTab("roadmap");
    }

    logAuditAction(
      "USER_LOGIN_SUCCESS",
      `Official authenticated successfully. Role: ${account.role.toUpperCase()}`,
      `${account.name} (${account.email})`,
      account.role.toUpperCase()
    );

    addToast("Welcome to Skill Setu", `Signed in as ${account.name} [${account.role.toUpperCase()}].`, "success");
    return { success: true };
  };

  const loginWithParichay = (targetRole = "learner") => {
    let email = "jso.aadeesh@mospi.gov.in";
    if (targetRole === "trainer") email = "faculty.nssta@mospi.gov.in";
    if (targetRole === "admin") email = "admin.mospi@mospi.gov.in";

    const account = accounts[email];
    setIsAuthenticated(true);
    setCurrentAccountKey(email);
    setRole(account.role);
    setActiveUserId(account.id);

    if (account.role === "admin") {
      setActiveHub("admin-analytics");
    } else if (account.role === "trainer") {
      setActiveHub("trainer-studio");
    } else {
      setActiveHub("learn");
      setHubSubTab("roadmap");
    }

    logAuditAction(
      "PARICHAY_SSO_LOGIN",
      `Authenticated via Jan Parichay National Gateway. Role: ${account.role.toUpperCase()}`,
      `${account.name} (${account.email})`,
      account.role.toUpperCase()
    );

    addToast("Parichay SSO Verified", `Signed in as ${account.name} (${account.role.toUpperCase()}).`, "success");
    return { success: true };
  };

  const logout = () => {
    const account = currentAccountKey ? accounts[currentAccountKey] : null;
    if (account) {
      logAuditAction(
        "USER_LOGOUT",
        `Session ended. Signed out of Skill Setu portal.`,
        `${account.name} (${account.email})`,
        account.role.toUpperCase()
      );
    }
    setIsAuthenticated(false);
    setCurrentAccountKey(null);
    setSelectedOfficialForDrilldown(null);
    setActiveHub("learn");
    addToast("Session Concluded", "You have been securely logged out.", "info");
  };

  // Complete Learner Onboarding
  const completeLearnerOnboarding = (data) => {
    const updatedComps = { ...currentUser.currentCompetencies };

    if (data.selfRatings) {
      Object.entries(data.selfRatings).forEach(([compId, rating]) => {
        let calibrated = Number(rating) || 2;
        const yrs = Number(data.experienceYears) || 0;
        if (yrs >= 4 && compId.startsWith("comp-stat")) {
          calibrated = Math.min(5, calibrated + 1);
        }
        updatedComps[compId] = Math.max(1, Math.min(5, calibrated));
      });
    }

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeUserId) {
          return {
            ...p,
            name: data.name || p.name,
            role: data.designation || p.role,
            cadre: data.cadre || p.cadre,
            department: data.department || p.department,
            location: data.location || p.location,
            qualification: data.qualification || p.qualification,
            experienceYears: Number(data.experienceYears) || p.experienceYears,
            focusSkills: data.focusSkills || p.focusSkills || [],
            currentCompetencies: updatedComps
          };
        }
        return p;
      })
    );

    setUserCompetencies(updatedComps);

    if (currentAccountKey) {
      setAccounts((prev) => ({
        ...prev,
        [currentAccountKey]: { ...prev[currentAccountKey], hasOnboarded: true, name: data.name || prev[currentAccountKey].name }
      }));
    }

    logAuditAction(
      "PROFILE_ONBOARDING_COMPLETED",
      `Official finalized first-time competency profiling with designation ${data.designation || "JSO"}`
    );

    setActiveHub("learn");
    setHubSubTab("roadmap");
    addToast("Competency Profile Generated", "Your official FRAC competency profile has been calibrated and saved.", "success");
  };

  // Update Learner Profile from Competency Hub
  const updateLearnerProfile = (data) => {
    completeLearnerOnboarding(data);
    addToast("Profile Updated", "Competency baseline and AI recommendations have recomputed.", "success");
  };

  // Complete Trainer Onboarding
  const completeTrainerOnboarding = (data) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeUserId) {
          return {
            ...p,
            name: data.name || p.name,
            role: data.role || p.role,
            department: data.department || p.department,
            qualification: data.qualification || p.qualification,
            experienceYears: Number(data.experienceYears) || p.experienceYears,
            subjectAreas: data.subjectAreas || []
          };
        }
        return p;
      })
    );

    if (currentAccountKey) {
      setAccounts((prev) => ({
        ...prev,
        [currentAccountKey]: { ...prev[currentAccountKey], hasOnboarded: true, name: data.name || prev[currentAccountKey].name }
      }));
    }

    logAuditAction("TRAINER_ONBOARDED", `Faculty finalized onboarding: ${data.name || "Faculty"}`);
    setActiveHub("trainer-studio");
    addToast("Faculty Onboarding Complete", "Welcome to the NSSTA Content Studio.", "success");
  };

  // Admin User Role Modification
  const changeUserRole = (userId, newCadreRole) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: newCadreRole } : p))
    );
    addToast("Official Role Updated", `Role updated to ${newCadreRole} in administrative registry.`, "success");
    logAuditAction("ADMIN_USER_ROLE_CHANGE", `Updated role of User ID ${userId} to ${newCadreRole}`);
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
    logAuditAction("COURSE_ENROLLMENT_IGOT", `Enrolled in ${course.code}: ${course.title}`);
  };

  // TPAC Nomination Action
  const nominateForTPAC = (tpacId) => {
    const prog = TPAC_PROGRAMMES.find((p) => p.id === tpacId);
    if (!prog) return;

    if (tpacNominations[tpacId]) {
      addToast("Nomination Under Review", `Your official nomination for "${prog.title}" has already been transmitted to NSSTA.`, "info");
      return;
    }

    setTpacNominations((prev) => ({
      ...prev,
      [tpacId]: { nominatedAt: new Date().toISOString().split("T")[0], status: "Nominated" }
    }));

    addToast(
      "TPAC Nomination Submitted",
      `Nomination submitted for ${prog.title} at ${prog.venue}. Forwarded to Division Head for approval.`,
      "success"
    );
    logAuditAction("TPAC_NOMINATION_SUBMIT", `Submitted nomination for TPAC Programme ${prog.code} (${prog.title})`);
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

  // Discussion Actions
  const addDiscussionReply = (threadId, replyText) => {
    const newReply = {
      id: "rep-" + Date.now(),
      authorName: currentUser.name,
      authorCadre: role === "trainer" ? `${currentUser.role} (NSSTA Faculty)` : currentUser.role,
      isFaculty: role === "trainer",
      authorAvatar: currentUser.avatar,
      postedDate: "Just now",
      content: replyText
    };

    setDiscussions((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t))
    );
    addToast("Reply Posted", "Your response has been published to the MoSPI Peer Discussion Board.", "success");
    logAuditAction("DISCUSSION_REPLY_POSTED", `Posted reply to Discussion Thread ID: ${threadId}`);
  };

  const addDiscussionThread = (newThread) => {
    const thread = {
      id: "disc-" + Date.now(),
      title: newThread.title,
      division: newThread.division || currentUser.department,
      topic: newThread.topic || "General Statistical Methodology",
      authorName: currentUser.name,
      authorCadre: role === "trainer" ? `${currentUser.role} (NSSTA Faculty)` : currentUser.role,
      authorAvatar: currentUser.avatar,
      postedDate: "Just now",
      upvotes: 1,
      tags: newThread.tags || ["MoSPI", "Survey Discussion"],
      content: newThread.content,
      replies: []
    };

    setDiscussions((prev) => [thread, ...prev]);
    addToast("Discussion Thread Created", "New thread published to Discuss Hub.", "success");
    logAuditAction("DISCUSSION_THREAD_CREATED", `Created Discussion Thread: "${thread.title}"`);
  };

  const upvoteDiscussion = (threadId) => {
    setDiscussions((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  // Network Connection Toggle
  const toggleNetworkConnection = (officerId) => {
    setMyNetwork((prev) => {
      const next = new Set(prev);
      if (next.has(officerId)) {
        next.delete(officerId);
        addToast("Connection Removed", "Official removed from My Network.", "info");
      } else {
        next.add(officerId);
        addToast("Connected on Civil Service Network", "Added official to your peer network directory.", "success");
        logAuditAction("NETWORK_PEER_CONNECTED", `Connected with Officer ID: ${officerId}`);
      }
      return next;
    });
  };

  // Event RSVP Toggle
  const toggleEventRSVP = (eventId) => {
    setEventsList((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const newStatus = !e.isRSVP;
          addToast(
            newStatus ? "RSVP Confirmed" : "RSVP Withdrawn",
            newStatus
              ? `You are confirmed for "${e.title}". Calendar invite queued.`
              : `RSVP cancelled for "${e.title}".`,
            newStatus ? "success" : "info"
          );
          if (newStatus) {
            logAuditAction("EVENT_RSVP_CONFIRMED", `Confirmed attendance for Event ID: ${eventId} (${e.title})`);
          }
          return {
            ...e,
            isRSVP: newStatus,
            registeredCount: newStatus ? e.registeredCount + 1 : e.registeredCount - 1,
          };
        }
        return e;
      })
    );
  };

  // Virtual Lab Code Execution Simulator
  const runVirtualLabCode = (customCode = null) => {
    const currentLab = VIRTUAL_LABS.find((l) => l.id === activeLabId) || VIRTUAL_LABS[0];
    setIsLabRunning(true);
    setLabConsoleOutput("Executing in sandbox container (MoSPI Python/SQL runtime)...\n[WAIT] Allocating cloud memory...\n");

    setTimeout(() => {
      setIsLabRunning(false);
      setLabConsoleOutput(currentLab.cannedOutput);
      addToast("Lab Execution Complete", `Successfully ran ${currentLab.title}. 0 Errors found.`, "success");
      logAuditAction("VIRTUAL_LAB_EXECUTED", `Executed Virtual Lab: ${currentLab.title}`);
    }, 1200);
  };

  // Rule-based Competency Profile Generator
  const generateCompetencyProfile = (formInput) => {
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
      "Skill matrix regenerated from cadre parameters and service record under FRAC guidelines.",
      "success"
    );
    logAuditAction("COMPETENCY_PROFILE_REGENERATED", `Profile re-evaluated for ${currentUser.name}`);
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

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setGeneratingStep(step);
        if (step === 5) {
          addToast("AI Question Generation Complete", `${doc.suggestedQuestionsCount} questions ready for trainer verification.`, "success");
          logAuditAction("AI_QUESTIONS_SYNTHESIZED", `Generated MCQ pool from manual: ${doc.name}`);
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
      author: `${currentUser.name} (NSSTA Faculty)`
    };

    setPublishedAssessments((prev) => [newAssessment, ...prev]);
    setGeneratingStep(0);
    addToast(
      "Assessment Published to iGOT Hub",
      `"${newAssessment.title}" is now available for all MoSPI officials.`,
      "success"
    );
    logAuditAction("ASSESSMENT_PUBLISHED", `Trainer published: ${newAssessment.title}`);
  };

  // Trainer: Author New Assessment from Scratch (Manual Builder)
  const authorManualAssessment = (customAssessment) => {
    const newAssessment = {
      id: "test-manual-" + Date.now(),
      title: customAssessment.title,
      topic: customAssessment.topic || "Custom Statistical Assessment",
      competencyIds: customAssessment.competencyIds || ["comp-stat-1"],
      timeLimitMinutes: customAssessment.timeLimitMinutes || 15,
      questions: customAssessment.questions,
      passingScore: customAssessment.passingScore || 60,
      attemptsCount: 0,
      author: `${currentUser.name} (NSSTA Faculty)`
    };

    setPublishedAssessments((prev) => [newAssessment, ...prev]);
    addToast("Manual Assessment Published", `"${newAssessment.title}" created from scratch and published.`, "success");
    logAuditAction("ASSESSMENT_MANUAL_PUBLISHED", `Trainer authored from scratch: ${newAssessment.title}`);
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
        logAuditAction("COMPETENCY_LEVEL_UPGRADE", `Learner ${currentUser.name} achieved Level ${nextLevel} in ${compInfo?.name}`);
      }
    } else {
      addToast(
        "Assessment Completed",
        `You scored ${scoreCount}/${totalQuestions} (${scorePercent}%). Passing score is ${assessment.passingScore}%. Review explanations below.`,
        passed ? "success" : "info"
      );
      logAuditAction("ASSESSMENT_ATTEMPT_COMPLETED", `Attempted ${assessment.title}: Scored ${scorePercent}%`);
    }
  };

  // AI Chat Assistant
  const sendChatMessage = (userText) => {
    const newMsg = { sender: "user", text: userText, timestamp: "Just now" };
    setChatMessages((prev) => [...prev, newMsg]);

    const lower = userText.toLowerCase();
    let reply = "";
    let suggestions = [];

    if (lower.includes("why") && (lower.includes("recommend") || lower.includes("course") || lower.includes("python"))) {
      reply = `Based on your profile as ${currentUser.role} in ${currentUser.department}, your target role (${currentTargetRole.title}) requires Python for Official Statistics at Level 3. Your current level is 2. Completing "Python for Official Statistics (MOSPI-TECH-201)" directly closes this 1-level gap.`;
      suggestions = ["Show NSSTA TPAC Programmes", "What are my critical skill gaps?"];
    } else if (lower.includes("tpac") || lower.includes("workshop") || lower.includes("program")) {
      reply = `NSSTA's Training Programme Advisory Committee (TPAC) offers in-person residential masterclasses at the Greater Noida campus. The "Advanced Survey Methodology Workshop" and "Python for Official Statistics Automation" cohort are currently open for nomination.`;
      suggestions = ["Take me to TPAC Programmes", "How do I apply for nomination?"];
    } else if (lower.includes("adaptive") || lower.includes("difficulty") || lower.includes("quiz")) {
      reply = `Skill Setu's Adaptive Assessment Engine adjusts question difficulty dynamically: if you answer 2 consecutive questions correctly, the next question automatically pulls from the Advanced tier; if you get 2 incorrect, it shifts to the Beginner tier to isolate your exact knowledge boundary.`;
      suggestions = ["Take an Adaptive Diagnostic Quiz", "Explain my last quiz mistake"];
    } else if (lower.includes("gap") || lower.includes("promotion") || lower.includes("sso") || lower.includes("next")) {
      reply = `To transition from ${currentUser.role} to ${currentTargetRole.title}, you have identified gaps in: 1) Python for Official Statistics (Gap: -1), 2) National Accounts & GDP (Gap: -1), and 3) Data Privacy & DPDP Act 2023 (Gap: -1). You can bridge them through iGOT self-paced courses or NSSTA residential cohorts.`;
      suggestions = ["Enroll me in DPDP Act 2023", "Show Career Progression Ladder"];
    } else if (lower.includes("jevons") || lower.includes("cpi") || lower.includes("price")) {
      reply = `In MoSPI Price Statistics, the Jevons formula compiles the unweighted geometric mean of price relatives: J = prod(P_t / P_0)^(1/N). It satisfies the time-reversal and transitivity tests, preventing the upward substitution bias of the Carli index.`;
      suggestions = ["How is WPI different from CPI?", "Open Price Statistics Virtual Lab"];
    } else if (lower.includes("dpdp") || lower.includes("privacy")) {
      reply = `Section 17 of India's Digital Personal Data Protection (DPDP) Act 2023 provides exemptions for processing personal data for statistical and scientific research purposes, provided the data is not used to make decisions affecting the specific data principal and statistical disclosure controls (k-anonymity, cell suppression) are enforced.`;
      suggestions = ["Open DPDP Virtual Lab", "Take the DPDP compliance quiz"];
    } else {
      reply = `Under MoSPI/NSSTA competency frameworks, each role is calibrated across Statistical, Technical, Digital Governance, and Behavioural domains under Mission Karmayogi's FRAC model. Explore the Six Hubs: Learn, Competency, Career, Discuss, Network, and Events!`;
      suggestions = ["Open Learn Hub", "View Discuss Forum"];
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
        isAuthenticated,
        accounts,
        currentAccount: currentAccountKey ? accounts[currentAccountKey] : null,
        login,
        loginWithParichay,
        logout,
        role,
        setRole,
        activeHub,
        setActiveHub,
        hubSubTab,
        setHubSubTab,
        activeTab: activeHub,
        setActiveTab,
        profiles,
        currentUser,
        activeUserId,
        completeLearnerOnboarding,
        updateLearnerProfile,
        completeTrainerOnboarding,
        changeUserRole,
        selectedOfficialForDrilldown,
        setSelectedOfficialForDrilldown,
        userCompetencies,
        targetRoleId,
        setTargetRoleId,
        currentTargetRole,
        enrolledCourses,
        enrollInCourse,
        updateCourseProgress,
        tpacNominations,
        nominateForTPAC,
        discussions,
        addDiscussionReply,
        addDiscussionThread,
        upvoteDiscussion,
        myNetwork,
        toggleNetworkConnection,
        eventsList,
        toggleEventRSVP,
        activeLabId,
        setActiveLabId,
        labCode,
        setLabCode,
        labConsoleOutput,
        isLabRunning,
        runVirtualLabCode,
        auditLogs,
        logAuditAction,
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
        publishGeneratedQuiz,
        authorManualAssessment,
        publishedAssessments,
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
