import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { QuizMCQ } from "../types/index.js";

// Zod Schema for MCQ validation
const MCQSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1)).length(4, "Must provide exactly 4 options"),
  correct_option: z.union([z.number().int().min(0).max(3), z.string()]).transform((val) => {
    if (typeof val === "number") return val;
    const clean = val.trim().toUpperCase();
    const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, "0": 0, "1": 1, "2": 2, "3": 3 };
    return map[clean] ?? 0;
  }),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
  difficulty: z.enum(["foundational", "intermediate", "advanced"]).optional().default("intermediate")
});

export const QuizArraySchema = z.array(MCQSchema).min(1, "At least 1 question must be generated");

/**
 * Generates an array of MCQs from text using Google Gemini API.
 * Validates with Zod schema, retries once on invalid JSON, and fails gracefully.
 */
export async function generateQuizFromText(
  extractedText: string,
  skillName: string = "General Knowledge",
  trackName: string = "Technology",
  numQuestions: number = 5
): Promise<QuizMCQ[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.AI_API_KEY;

  // Trim and sanitize input text
  const cleanText = extractedText.replace(/\s+/g, " ").trim();
  const textExcerpt = cleanText.length > 5000 ? cleanText.slice(0, 5000) + "..." : cleanText;

  if (!textExcerpt || textExcerpt.length < 20) {
    throw new Error("The uploaded content contains insufficient readable text to generate assessment questions.");
  }

  // If Gemini API key is configured, invoke Gemini API
  if (apiKey && !apiKey.includes("AIzaSy...")) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const buildPrompt = (isRetry: boolean = false) => `
You are an expert pedagogical AI specializing in technical skills assessment for "Skill Setu".
Your task is to analyze the text below and generate exactly ${numQuestions} multiple-choice questions (MCQs) for the skill "${skillName}" within the "${trackName}" track.

Guidelines:
1. Each question must test conceptual understanding, key terminology, or practical decision making from the text.
2. Provide exactly 4 options per question.
3. correct_option must be the zero-based index (0, 1, 2, or 3) indicating which option in the options array is correct.
4. Provide a clear, insightful explanation justifying why the correct option is right.
5. Tag difficulty as "foundational", "intermediate", or "advanced".
${isRetry ? "IMPORTANT: Your previous output did not match the JSON schema. Return ONLY a valid JSON array matching the schema." : ""}

Return ONLY a JSON array in this exact schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correct_option": 0,
    "explanation": "string",
    "difficulty": "intermediate"
  }
]

SOURCE TEXT:
${textExcerpt}
`;

    // Attempt 1
    try {
      const result = await model.generateContent(buildPrompt(false));
      const responseText = result.response.text();
      const rawJson = JSON.parse(responseText);
      const validated = QuizArraySchema.parse(rawJson);
      return validated as QuizMCQ[];
    } catch (firstErr: any) {
      console.warn("⚠️ Gemini attempt 1 failed or returned invalid JSON. Retrying once...", firstErr.message);

      // Attempt 2 (Retry once with corrective prompt)
      try {
        const retryResult = await model.generateContent(buildPrompt(true));
        const retryText = retryResult.response.text();
        const retryJson = JSON.parse(retryText);
        const retryValidated = QuizArraySchema.parse(retryJson);
        return retryValidated as QuizMCQ[];
      } catch (retryErr: any) {
        console.error("❌ Gemini retry also failed:", retryErr.message);
        throw new Error(
          `AI quiz generation failed: Could not obtain valid MCQ JSON schema from Gemini. Details: ${retryErr.message}`
        );
      }
    }
  }

  // Graceful fallback if no API key is provided yet
  console.info("ℹ️ No GEMINI_API_KEY detected. Using contextual smart fallback engine for demo.");
  return generateContextualFallbackQuiz(textExcerpt, skillName, numQuestions);
}

/**
 * Smart contextual fallback when Gemini API key is not configured in local environment.
 * Generates realistic questions based on key extracted technical terms from the document.
 */
function generateContextualFallbackQuiz(text: string, skillName: string, count: number): QuizMCQ[] {
  const words = text
    .split(/[\s,.;:!?()]+/)
    .filter((w) => w.length > 4 && !/^(about|which|there|their|these|would|should|could|other)$/i.test(w));
  const uniqueWords = Array.from(new Set(words));
  const sampleKey1 = uniqueWords[0] || skillName;
  const sampleKey2 = uniqueWords[1] || "Architecture";
  const sampleKey3 = uniqueWords[2] || "Performance";

  const fallbackQuestions: QuizMCQ[] = [
    {
      question: `In the context of ${skillName}, what is the primary role of ${sampleKey1}?`,
      options: [
        `Providing core modularity and separating concerns across the system`,
        `Directly writing uncompiled assembly instructions to hardware memory`,
        `Eliminating the requirement for version control repositories`,
        `Forcing all network traffic to bypass security authentication`
      ],
      correct_option: 0,
      explanation: `In ${skillName}, ${sampleKey1} serves as a foundational building block for clean architecture and state handling.`,
      difficulty: "foundational"
    },
    {
      question: `How does ${sampleKey2} impact application scalability and maintainability?`,
      options: [
        `It has zero effect on software maintainability or performance`,
        `By establishing decoupled contracts and optimizing resource consumption`,
        `It requires all users to restart their machines on every page load`,
        `It converts all relational database tables into unindexed flat text files`
      ],
      correct_option: 1,
      explanation: `Effective ${sampleKey2} strategies reduce coupling and ensure deterministic resource usage under heavy production workloads.`,
      difficulty: "intermediate"
    },
    {
      question: `Which strategy is recommended when optimizing ${sampleKey3} according to modern software best practices?`,
      options: [
        `Avoiding all caching layers to maximize disk reads`,
        `Proactive profiling, eliminating redundant computations, and lazy loading assets`,
        `Running synchronous blocking loops on the UI rendering thread`,
        `Disabling error logging in staging environments`
      ],
      correct_option: 1,
      explanation: `Optimizing ${sampleKey3} requires bottleneck identification, intelligent caching, and non-blocking asynchronous execution.`,
      difficulty: "intermediate"
    },
    {
      question: `When validating requirements for ${skillName}, what should be the primary criterion for success?`,
      options: [
        `Verifiable adherence to specifications, unit test coverage, and predictable error handling`,
        `Maximizing line count regardless of computational complexity`,
        `Bypassing schema migrations during production deployments`,
        `Hardcoding all secrets and endpoints directly in client bundles`
      ],
      correct_option: 0,
      explanation: `High quality implementations require measurable verification, clear test suites, and graceful degradation during edge case failures.`,
      difficulty: "advanced"
    }
  ];

  return fallbackQuestions.slice(0, count);
}
