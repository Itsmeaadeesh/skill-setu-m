import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: "learner" | "admin";
  targetTrackId?: string | null;
  hasOnboarded: boolean;
  avatar?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface QuizMCQ {
  question: string;
  options: string[];
  correct_option: number;
  explanation: string;
  difficulty?: "foundational" | "intermediate" | "advanced";
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  icon: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number; // requiredLevel - currentLevel
  tag: "foundational" | "intermediate" | "advanced";
  source: string;
  isMet: boolean;
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
