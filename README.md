# 🌉 Skill Setu — AI-Enabled Skill Assessment & Course Recommendation Platform

> **"Skill Setu" (Bridging Competencies to Careers)** is a production-grade, full-stack ed-tech web application that diagnoses learner deficiencies through interactive self-ratings and validated baseline assessments, performs automated skill-gap analysis against target career tracks, sequences linear foundational-first course roadmaps, and synthesizes verified diagnostic MCQs from uploaded study materials (PDF/PPT/DOCX with Tesseract OCR) using **Google Gemini 1.5/2.0 Flash**.

[![React](https://img.shields.io/badge/React_19-TypeScript-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_TS-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal?logo=prisma)](https://prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-emerald?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange?logo=google)](https://aistudio.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS_v4-UI-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Key Highlights & Core Modules

1. **Auth & Role-Based Access Control**:
   - Supabase Auth supporting Email/Password and Google OAuth sign-in.
   - Dual roles: `learner` and `admin`, enforced via Express authentication middleware verifying Supabase JWTs.
   - First-time learner onboarding wizard with career track selection (`Frontend Developer`, `Data Analyst`, `Full Stack AI Engineer`).
   - 1-Click Evaluator Personas for immediate testing without registration friction.

2. **Skill Assessment & Diagnostic Calibration**:
   - Interactive 1-5 proficiency level sliders with real-world competency descriptors.
   - Standardized baseline MCQ quizzes with timers and question pagination.
   - Persisted in Prisma `SkillProfile` model (`userId`, `skillId`, `level`, `source: quiz/self-rated`).

3. **Mathematical Skill-Gap Analysis**:
   - Compares learner's `SkillProfile` against `TrackRequirement` model (`requiredLevel - currentLevel`).
   - Outputs ranked deficit list sorted descending, tagged as `Foundational`, `Intermediate`, or `Advanced`.
   - Real-time overall track readiness percentage calculation.

4. **Curated Linear Course Recommendation Engine**:
   - Maintains a `Course` model tagged by `skillId` and difficulty level.
   - Automatically matches courses to active skill gaps, ordered foundational-first into a linear step-by-step roadmap.

5. **AI Quiz Generation with Gemini Flash & Tesseract OCR**:
   - Upload syllabus, lecture notes, or textbooks in PDF, DOCX, or PPTX format to Supabase Storage.
   - Built-in text extractor: `pdf-parse`, `mammoth` (DOCX), and automated **Tesseract.js OCR** fallback for scanned/image-based PDFs.
   - Single backend service `generateQuizFromText()` calling Google Gemini API (`@google/generative-ai`) with `responseMimeType: "application/json"`.
   - Strict Zod schema validation ensuring `{ question, options[4], correct_option: 0-3, explanation, difficulty }`.
   - Automatic 1-retry error recovery on malformed responses with graceful fallback.

6. **Instant Telemetry & Scoring**:
   - Instant automated grading comparing submitted options against answer keys.
   - Persisted in `QuizAttempt` model (`userId`, `quizId`, `score`, `percentage`, `passed`, `answersJson`).
   - Dynamically elevates the learner's `SkillProfile` proficiency level based on test performance.

7. **Real-time Recalculation**:
   - After quiz submission or rating changes, the platform re-computes skill gaps and re-sequences recommended paths immediately.

8. **Rich Visual Dashboards (Recharts)**:
   - **Learner Dashboard**: 360° Competency Radar Chart, Proficiency vs Requirement Bar Chart, ranked gap list, linear path cards, and attempt history table with pedagogy review modal.
   - **Admin Dashboard**: Aggregate cohort telemetry, Most Common Platform Gaps Bar Chart, Average Scores by Track Bar Chart, quiz repository management, and enrolled learner directory.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React 19 + TypeScript + Vite + TailwindCSS)"]
        UI["Modern Card & Sidebar UI"]
        Recharts["Recharts (Radar & Bar Visualizations)"]
        SupaClient["Supabase Auth & Storage Client"]
        State["PlatformContext (Session & Data Telemetry)"]
    end

    subgraph Backend["Backend API (Node.js + Express + TypeScript)"]
        AuthMiddleware["Auth Middleware (Supabase JWT / Local Fallback)"]
        Controllers["Express Route Controllers"]
        
        subgraph Services["Core Engine Services"]
            AIService["ai.service.ts (Gemini Flash + Zod Validation)"]
            DocService["document.service.ts (Parsers + Tesseract OCR)"]
            GapService["gapAnalysis.service.ts (Deficit Ranking Engine)"]
            RecService["recommendation.service.ts (Linear Sequencing)"]
        end
    end

    subgraph CloudAndDB["Data Layer & External Services"]
        SupabaseDB[("Supabase PostgreSQL / SQLite Dev DB")]
        PrismaORM["Prisma ORM Client"]
        GeminiAPI["Google Gemini API (1.5 / 2.0 Flash)"]
        SupabaseStore["Supabase Storage (documents bucket)"]
    end

    UI --> State
    State --> Recharts
    State --> SupaClient
    State -->|HTTP + Bearer Token| AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Services
    DocService -->|Extract / OCR| AIService
    AIService -->|JSON Output| GeminiAPI
    Controllers --> PrismaORM
    PrismaORM --> SupabaseDB
    SupaClient -->|Direct File Upload| SupabaseStore
```

---

## 🗄️ Database Schema (Prisma ORM)

The database schema strictly adheres to the 10 domain entities:

- **`User`**: Account details, role (`learner` | `admin`), `targetTrackId`, onboarding flag.
- **`Track`**: Career tracks (`Frontend Developer`, `Data Analyst`, `Full Stack & AI Engineer`).
- **`Skill`**: Competencies tagged by category (`React`, `TypeScript`, `SQL`, `Python`, `Node.js`).
- **`TrackRequirement`**: Target proficiency levels (1-5 scale) required for each track.
- **`SkillProfile`**: Learner's calibrated level (1-5) and assessment source (`quiz` | `self-rated`).
- **`Course`**: Curriculum courses tagged by `skillId` and difficulty (`foundational`, `intermediate`, `advanced`).
- **`Quiz`**: Diagnostic baseline assessments and AI-synthesized quizzes from documents.
- **`QuizQuestion`**: Individual MCQs with 4 options, `correct_option` index, and pedagogy explanation.
- **`QuizAttempt`**: Completed student tests with score %, pass status, timestamp, and full review JSON.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in root and `server/.env`:

```env
# Server Port & Client URL
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=skill_setu_super_secret_jwt_key_2026_secure

# Database URL (Supabase PostgreSQL or zero-config local SQLite)
# Supabase format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_URL="file:./dev.db"

# Supabase Auth & Storage
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Gemini API
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash

# Google OAuth (for Supabase Google sign-in)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

> **Note on Zero-Config Local Testing**:
> If you do not yet have a Supabase project or Gemini key, the application works immediately out-of-the-box using the bundled SQLite database (`dev.db`) and smart heuristic AI fallback. You can input your cloud credentials whenever you're ready to deploy to production.

---

## 🛠️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Itsmeaadeesh/skill-setu.git
cd skill-setu
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Initialize & Seed Database
```bash
# Push Prisma schema and seed initial tracks, courses, skills, and baseline quizzes
npm run seed
```

### 4. Run the Full-Stack Application
```bash
# Start both Backend API (:5000) and Vite Web Frontend (:5173) simultaneously:
npm run fullstack
```

Or run them in separate terminals:
- **Terminal 1 (Backend API)**: `npm run server`
- **Terminal 2 (Vite Frontend)**: `npm run dev`

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Automated Testing & Verification

Execute the end-to-end verification suite:

```bash
npm run test:e2e
```

The test validates all 10 core modules:
- ✅ Backend healthcheck and database connectivity
- ✅ Student authentication and session profile
- ✅ Track listing and requirement resolution
- ✅ Skill gap analysis with descending deficit ranking & difficulty tagging
- ✅ Recommendation engine linear foundational-first path generation
- ✅ Assessment self-rating calibration and profile update
- ✅ AI quiz synthesis from document upload with Zod schema validation
- ✅ Instant quiz attempt scoring and SkillProfile promotion
- ✅ Telemetry and attempt history persistence
- ✅ Admin institutional analytics and aggregate gap charts

---

## 👥 Evaluator Personas (1-Click Demo Accounts)

On the login page or top navigation bar, use the **Persona Switcher** to test without creating an account:

| Persona | Role | Enrolled Track | Focus |
|---|---|---|---|
| **Aaditya Sharma** (`learner@skillsetu.ai`) | Learner | Frontend Developer | Calibrated gaps in React & TypeScript |
| **Rohan Patel** (`analyst@skillsetu.ai`) | Learner | Data Analyst | SQL & Python for Data analysis |
| **Dr. Sunita Rao** (`admin@skillsetu.ai`) | Admin | Institution Director | Full institutional analytics & quiz manager |

*(Default password for all seeded accounts: `Password123!`)*

---

## 🎓 College Minor Project Checklist

- [x] Full-stack architecture with React 19, TypeScript, Express, and Prisma ORM.
- [x] Supabase Auth (Email/Password + Google OAuth) and Supabase Storage integration.
- [x] Real-time Recharts visualizations (Radar Chart & Comparative Bar Charts).
- [x] Google Gemini Flash integration with strict JSON mode & Zod schema validation.
- [x] Document parser supporting PDF, DOCX, PPTX, and Tesseract OCR for scanned documents.
- [x] Instant grading and automatic recalculation of skill profiles and learning paths.
- [x] Role-gated administration dashboard with platform-wide gap aggregation.
- [x] Clean, responsive, card-based EdTech UI with dark/light mode.
- [x] Portfolio and presentation ready with zero-friction evaluation.

---

## 📄 License
MIT © 2026 Skill Setu Development Team
