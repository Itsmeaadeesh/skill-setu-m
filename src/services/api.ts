import {
  User,
  Track,
  SkillProfile,
  GapAnalysisResult,
  LearningPathResult,
  Course,
  Quiz,
  QuizAttempt,
  QuizAttemptResult,
  AdminAnalytics
} from "../types/index.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("skill_setu_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: { email: string; password: string; name: string; targetTrackId?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Registration failed");
    return json;
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");
    return json;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load session profile");
    return json;
  },

  async completeOnboarding(targetTrackId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/onboard`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ targetTrackId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to complete onboarding");
    return json;
  },

  async switchDemo(email: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Demo switch failed");
    return json;
  },

  async listDemoAccounts(): Promise<Array<{ id: string; email: string; name: string; role: string; targetTrack?: { name: string } }>> {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    if (!res.ok) return [];
    return res.json();
  },

  // Tracks
  async getTracks(): Promise<Track[]> {
    const res = await fetch(`${API_BASE}/tracks`);
    if (!res.ok) throw new Error("Failed to fetch tracks");
    return res.json();
  },

  async getTrackById(id: string): Promise<Track> {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    if (!res.ok) throw new Error("Failed to fetch track details");
    return res.json();
  },

  // Assessments & Self Ratings
  async submitSelfRatings(ratings: Array<{ skillId: string; level: number }>): Promise<{ updatedProfiles: SkillProfile[]; freshGaps: GapAnalysisResult }> {
    const res = await fetch(`${API_BASE}/assessments/self-rate`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ ratings })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to update skill self-ratings");
    return json;
  },

  async getMySkillProfiles(): Promise<SkillProfile[]> {
    const res = await fetch(`${API_BASE}/assessments/my-profile`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch skill profiles");
    return res.json();
  },

  // Skill Gap Analysis
  async getMyGaps(trackId?: string): Promise<GapAnalysisResult> {
    const url = trackId ? `${API_BASE}/gap-analysis/my-gaps?trackId=${trackId}` : `${API_BASE}/gap-analysis/my-gaps`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to analyze skill gaps");
    return json;
  },

  // Recommendations
  async getMyLearningPath(trackId?: string): Promise<LearningPathResult> {
    const url = trackId ? `${API_BASE}/recommendations/my-path?trackId=${trackId}` : `${API_BASE}/recommendations/my-path`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to generate learning path");
    return json;
  },

  // Courses
  async getCourses(filters?: { skillId?: string; trackId?: string; difficulty?: string }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters?.skillId) params.append("skillId", filters.skillId);
    if (filters?.trackId) params.append("trackId", filters.trackId);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    const res = await fetch(`${API_BASE}/courses?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  async getCourseById(id: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    if (!res.ok) throw new Error("Failed to fetch course details");
    return res.json();
  },

  // Quizzes & AI Generation
  async listQuizzes(filters?: { trackId?: string; skillId?: string; isBaseline?: boolean }): Promise<Quiz[]> {
    const params = new URLSearchParams();
    if (filters?.trackId) params.append("trackId", filters.trackId);
    if (filters?.skillId) params.append("skillId", filters.skillId);
    if (filters?.isBaseline !== undefined) params.append("isBaseline", String(filters.isBaseline));
    const res = await fetch(`${API_BASE}/quizzes?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
  },

  async getQuizById(id: string, mode: "take" | "review" = "take"): Promise<Quiz> {
    const res = await fetch(`${API_BASE}/quizzes/${id}?mode=${mode}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to fetch quiz");
    return json;
  },

  async generateQuizFromFile(formData: FormData): Promise<{ message: string; quiz: Quiz; isScannedPdf: boolean }> {
    const headers = getAuthHeaders();
    // Do NOT set Content-Type header when sending FormData; browser automatically sets multipart/form-data boundary
    const res = await fetch(`${API_BASE}/quizzes/generate-from-file`, {
      method: "POST",
      headers,
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "AI Quiz generation failed");
    return json;
  },

  async submitQuizAttempt(quizId: string, answers: Record<string, number>): Promise<QuizAttemptResult> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to submit quiz attempt");
    return json;
  },

  async getMyAttempts(): Promise<QuizAttempt[]> {
    const res = await fetch(`${API_BASE}/quizzes/my-attempts`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch quiz attempts");
    return res.json();
  },

  async deleteQuiz(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "Failed to delete quiz");
    }
  },

  // Admin Analytics
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load admin analytics");
    return json;
  }
};
