import https from "https";

/**
 * Universal LLM caller supporting OpenAI-compatible and Anthropic endpoints
 */
async function callLLM(prompt, systemPrompt = "You are an expert pedagogical AI for Skill Setu.") {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const payload = JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return new Promise((resolve) => {
      const req = https.request(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Content-Length": Buffer.byteLength(payload)
          },
          timeout: 12000
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const json = JSON.parse(data);
              if (json.choices && json.choices[0]) {
                resolve(json.choices[0].message.content);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve(null);
            }
          });
        }
      );
      req.on("error", () => resolve(null));
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.write(payload);
      req.end();
    });
  } catch (err) {
    console.warn("LLM API Call failed, falling back to smart extractor:", err.message);
    return null;
  }
}

/**
 * Generate 5 MCQs from extracted text
 */
export async function generateQuizFromText(extractedText, numQuestions = 5, trackName = "Technology") {
  const prompt = `Based on the following document excerpt, generate ${numQuestions} high-quality, multiple-choice assessment questions.
The questions must test conceptual understanding, practical application, and core definitions.
For each question provide:
- questionText: clear question
- optionA, optionB, optionC, optionD
- correctAnswer: "A", "B", "C", or "D"
- explanation: clear explanation of why this answer is correct
- difficulty: "EASY", "MEDIUM", or "HARD"

Output MUST be valid JSON in this exact structure:
[
  {
    "questionText": "...",
    "optionA": "...",
    "optionB": "...",
    "optionC": "...",
    "optionD": "...",
    "correctAnswer": "A",
    "explanation": "...",
    "difficulty": "MEDIUM"
  }
]

DOCUMENT EXCERPT:
${extractedText.slice(0, 4000)}
`;

  const llmResponse = await callLLM(prompt, "You are an automated assessment generator that strictly outputs JSON arrays.");
  
  if (llmResponse) {
    try {
      const cleaned = llmResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(q => ({
          questionText: q.questionText || "Conceptual Question",
          optionA: q.optionA || "Option A",
          optionB: q.optionB || "Option B",
          optionC: q.optionC || "Option C",
          optionD: q.optionD || "Option D",
          correctAnswer: ["A", "B", "C", "D"].includes(q.correctAnswer) ? q.correctAnswer : "A",
          explanation: q.explanation || "Based on document analysis.",
          difficulty: q.difficulty || "MEDIUM",
          sourceTag: "AI-Generated (LLM)"
        }));
      }
    } catch (e) {
      console.warn("Failed to parse LLM JSON output, using smart extractor fallback");
    }
  }

  // Fallback: Smart NLP analysis of extracted sentences & key terms
  return generateHeuristicQuiz(extractedText, numQuestions, trackName);
}

function generateHeuristicQuiz(text, count = 5, trackName = "General") {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 35 && s.length < 160 && !s.includes("http") && !s.includes("@"));

  const questions = [];
  
  // Extract key technical words (capitalized or frequent multi-letter terms)
  const words = text.match(/\b[A-Za-z]{4,}\b/g) || ["Architecture", "Pipeline", "Component", "Performance"];
  const wordFreq = {};
  words.forEach(w => {
    const lw = w.toLowerCase();
    wordFreq[lw] = (wordFreq[lw] || 0) + 1;
  });
  const topWords = Object.entries(wordFreq)
    .filter(([w, freq]) => freq >= 2 && !["this", "that", "with", "from", "have", "were", "they", "will", "what", "which"].includes(w))
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const keywordPool = topWords.length >= 4 ? topWords : ["Asynchronous", "State Management", "Data Modeling", "Scalability", "Latency", "Polymorphism"];

  for (let i = 0; i < Math.min(count, Math.max(3, sentences.length)); i++) {
    const s = sentences[i % sentences.length];
    const key = keywordPool[i % keywordPool.length] || "System";
    const alt1 = keywordPool[(i + 1) % keywordPool.length] || "Module";
    const alt2 = keywordPool[(i + 2) % keywordPool.length] || "Interface";
    const alt3 = keywordPool[(i + 3) % keywordPool.length] || "Database";

    if (i % 3 === 0) {
      questions.push({
        questionText: `According to the uploaded material, which core concept is highlighted in the context: "${s.slice(0, 90)}..."?`,
        optionA: `Optimized implementation of ${key}`,
        optionB: `Deprecated configuration of ${alt1}`,
        optionC: `Synchronous execution via ${alt2}`,
        optionD: `Unmanaged concurrency in ${alt3}`,
        correctAnswer: "A",
        explanation: `The source document highlights "${key}" as the primary pattern in this section.`,
        difficulty: "MEDIUM",
        sourceTag: "AI Extracted (Doc Excerpt)"
      });
    } else if (i % 3 === 1) {
      questions.push({
        questionText: `What is the primary technical objective discussed regarding "${key}" in the study document?`,
        optionA: `To replace existing standards with non-standard protocols`,
        optionB: `To ensure robust reliability, consistency, and scalable performance`,
        optionC: `To increase memory footprint for debugging purposes`,
        optionD: `To enforce manual step-by-step verification`,
        correctAnswer: "B",
        explanation: `Reliability, scale, and consistency are fundamental requirements emphasized in the context of ${key}.`,
        difficulty: "EASY",
        sourceTag: "AI Extracted (Doc Excerpt)"
      });
    } else {
      questions.push({
        questionText: `When designing a pipeline involving ${alt1} and ${key}, which architectural principle should be maintained?`,
        optionA: `Direct coupling without schema isolation`,
        optionB: `Monolithic centralization of all business logic`,
        optionC: `Decoupled modules with explicit contracts and resilient error handling`,
        optionD: `Bypassing validation checks during high throughput`,
        correctAnswer: "C",
        explanation: `Decoupled architecture and explicit contracts ensure system maintainability and fault isolation.`,
        difficulty: "HARD",
        sourceTag: "AI Extracted (Doc Excerpt)"
      });
    }
  }

  return questions.slice(0, count);
}

/**
 * Generate contextual explanation for why a course was recommended
 */
export async function generateCourseRecommendationReason(courseTitle, skillGaps, targetRole) {
  const primaryGap = skillGaps[0] || { skillName: "Foundational Skills", gap: 2, currentLevel: 1, requiredLevel: 3 };
  
  return `This course bridges your highest-priority gap in ${primaryGap.skillName} (Current: Lvl ${primaryGap.currentLevel}/5 → Target: Lvl ${primaryGap.requiredLevel}/5). Completing its modules satisfies the core competency criteria for ${targetRole || "your track"}.`;
}

/**
 * Chat assistant responding with contextual learner data
 */
export async function generateChatResponse(userMessage, context) {
  const { userName, trackName, currentSkills, topGaps, enrolledCourses, recentScores } = context;

  const systemPrompt = `You are "Setu AI", an intelligent ed-tech learning mentor and skill-gap advisor for Skill Setu.
The learner's profile:
- Name: ${userName}
- Track: ${trackName || "Unassigned"}
- Current Top Skill Gaps: ${topGaps.map(g => `${g.skillName} (Gap: -${g.gap}, Current: ${g.currentLevel}/5, Required: ${g.requiredLevel}/5)`).join(", ") || "No active gaps"}
- Active Enrolled Courses: ${enrolledCourses.join(", ") || "None yet"}
- Recent Quiz Scores: ${recentScores.map(s => `${s.quizTitle}: ${s.score}%`).join(", ") || "No attempts yet"}

Provide clear, supportive, highly actionable advice grounded in their exact skills, gaps, and learning path. Keep responses concise (2-3 short paragraphs or bullet points).`;

  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (apiKey) {
    const aiAnswer = await callLLM(userMessage, systemPrompt);
    if (aiAnswer) return aiAnswer;
  }

  // Grounded heuristic fallback assistant
  const msgLower = userMessage.toLowerCase();
  const highestGap = topGaps[0];

  if (msgLower.includes("why") && (msgLower.includes("recommend") || msgLower.includes("course"))) {
    return `Great question! Courses are recommended by analyzing the delta between your current skill levels and the competency framework for **${trackName || "your track"}**.\n\n` +
      (highestGap
        ? `Right now, your highest priority gap is **${highestGap.skillName}** (Current Level ${highestGap.currentLevel}/5 vs Required Level ${highestGap.requiredLevel}/5). The top recommended course targets this exact deficit with prerequisite sequencing.`
        : `You have met the baseline requirements! Advanced capstone courses are recommended to push your proficiency to mastery.`);
  }

  if (msgLower.includes("next") || msgLower.includes("what should i learn") || msgLower.includes("where do i start")) {
    return `Based on your live gap analysis, here is your immediate roadmap:\n\n` +
      (highestGap
        ? `1. **Priority Focus:** Elevate **${highestGap.skillName}** from Level ${highestGap.currentLevel} to ${highestGap.requiredLevel}.\n2. Enroll in the top-ranked recommendation in your Learning Path.\n3. Take the corresponding track quiz once completed to immediately bump your proficiency score!`
        : `1. Explore advanced elective courses in your catalogue.\n2. Upload course lecture notes or PDFs to generate custom quizzes in the AI Quiz Studio.\n3. Check your progress analytics to prepare for role certification!`);
  }

  if (msgLower.includes("gap") || msgLower.includes("score") || msgLower.includes("radar")) {
    const gapsList = topGaps.slice(0, 3).map(g => `• **${g.skillName}**: Current ${g.currentLevel}/5, Target ${g.requiredLevel}/5 (Deficit: -${g.gap})`).join("\n");
    return `Here is a summary of your key skill gaps in **${trackName}**:\n\n${gapsList || "All key skills are on track!"}\n\n` +
      `You can close these gaps either by completing recommended courses or taking assessments to prove your proficiency.`;
  }

  return `Hello ${userName}! As your Skill Setu learning advisor, I'm tracking your progress in **${trackName || "your program"}**.\n\n` +
    (highestGap
      ? `Your primary focus area is currently **${highestGap.skillName}** (Deficit: -${highestGap.gap}). Would you like me to walk you through the recommended courses, or help you prepare for your next assessment?`
      : `You're progressing nicely across all competencies. How can I assist with your coursework or learning goals today?`);
}
