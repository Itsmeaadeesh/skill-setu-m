export type UserRole = "learner" | "admin";

export interface User {
  id: string;
  supabaseUid?: string | null;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  targetTrackId?: string | null;
  targetTrack?: Track | null;
  hasOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
  skillProfiles?: SkillProfile[];
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;
  requirements?: TrackRequirement[];
  courses?: Course[];
  quizzes?: Quiz[];
  _count?: {
    users?: number;
    courses?: number;
    quizzes?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  icon: string;
}

export interface TrackRequirement {
  id: string;
  trackId: string;
  skillId: string;
  requiredLevel: number;
  skill: Skill;
}

export interface SkillProfile {
  id: string;
  userId: string;
  skillId: string;
  level: number; // 1 to 5
  source: "quiz" | "self-rated" | string;
  lastAssessedAt: string;
  skill: Skill;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  tag: "foundational" | "intermediate" | "advanced";
  source: string;
  isMet: boolean;
}

export interface GapAnalysisResult {
  track: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  gaps: SkillGapItem[];
  unmetGaps: SkillGapItem[];
  readinessPercentage: number;
  totalSkills: number;
  skillsMastered: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  skillId: string;
  trackId?: string | null;
  difficulty: "foundational" | "intermediate" | "advanced" | string;
  durationHours: number;
  provider: string;
  rating: number;
  thumbnail?: string | null;
  url?: string | null;
  skill?: Skill;
  track?: Track;
}

export interface CoursePathItem {
  id: string;
  title: string;
  description: string;
  skillId: string;
  skillName: string;
  difficulty: "foundational" | "intermediate" | "advanced";
  durationHours: number;
  provider: string;
  rating: number;
  stepNumber: number;
}

export interface LearningPathResult {
  trackName: string;
  totalSteps: number;
  estimatedHours: number;
  path: CoursePathItem[];
  unmetSkillsCovered: string[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[]; // parsed array
  correct_option?: number; // only present in review mode or score response
  explanation?: string;
  difficulty: "foundational" | "intermediate" | "advanced" | string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  trackId?: string | null;
  skillId?: string | null;
  sourceFileUrl?: string | null;
  sourceFilename?: string | null;
  isBaseline: boolean;
  timeLimitMinutes: number;
  createdAt: string;
  skill?: Skill | null;
  track?: Track | null;
  questions?: QuizQuestion[];
  _count?: {
    questions?: number;
    attempts?: number;
  };
}

export interface QuestionReviewItem {
  questionId: string;
  question: string;
  options: string[];
  selectedOption: number | null;
  correctOption: number;
  isCorrect: boolean;
  explanation: string;
  difficulty: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answersJson: string;
  timestamp: string;
  quiz: Quiz;
}

export interface QuizAttemptResult {
  message: string;
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  questionsReview: QuestionReviewItem[];
  updatedSkillLevel?: SkillProfile | null;
  freshGaps?: GapAnalysisResult;
  freshPath?: LearningPathResult;
}

export interface AdminAnalytics {
  metrics: {
    totalLearners: number;
    totalTracks: number;
    totalQuizzes: number;
    totalAttempts: number;
    averagePlatformScore: number;
  };
  commonGaps: Array<{
    skillName: string;
    category: string;
    trackName: string;
    requiredLevel: number;
    averageGap: number;
    learnersCount: number;
  }>;
  trackAverages: Array<{
    trackId: string;
    trackName: string;
    attemptsCount: number;
    averageScore: number;
  }>;
  learners: Array<{
    id: string;
    name: string;
    email: string;
    targetTrack: string;
    skillsAssessed: number;
    quizzesTaken: number;
    averageScore: number;
    joinedAt: string;
  }>;
}
