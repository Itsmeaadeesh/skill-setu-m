import fs from "fs";
import path from "path";

const API_BASE = "http://localhost:5000/api";

async function runE2ETests() {
  console.log("=========================================================");
  console.log("🚀 STARTING SKILL SETU FULL-STACK E2E VERIFICATION SUITE");
  console.log("=========================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName} ${detail ? `(${detail})` : ""}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  try {
    // 1. Module 10 & Health: Healthcheck & Database Connection
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    assert(health.status === "healthy", "Backend Healthcheck & DB Connection", health.service);

    // 2. Module 1: Auth & Login (Learner)
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "learner@skillsetu.ai", password: "Password123!" })
    });
    const loginData = await loginRes.json();
    assert(loginRes.ok && Boolean(loginData.token), "Auth: Learner Login", `User: ${loginData.user?.name}`);
    const token = loginData.token;
    const authHeaders = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

    // 3. Module 1: Tracks & Requirements
    const tracksRes = await fetch(`${API_BASE}/tracks`);
    const tracksData = await tracksRes.json();
    assert(Array.isArray(tracksData) && tracksData.length >= 3, "Tracks API", `${tracksData.length} tracks loaded`);

    // 4. Module 3: Skill Gap Analysis
    const gapRes = await fetch(`${API_BASE}/gap-analysis/my-gaps`, { headers: authHeaders });
    const gapData = await gapRes.json();
    assert(gapRes.ok && gapData.gaps.length > 0, "Skill Gap Analysis API", `Readiness: ${gapData.readinessPercentage}%, Gaps: ${gapData.gaps.length}`);
    
    // Check gap ordering (descending)
    let isDescending = true;
    for (let i = 0; i < gapData.gaps.length - 1; i++) {
      if (gapData.gaps[i].gap < gapData.gaps[i + 1].gap) isDescending = false;
    }
    assert(isDescending, "Skill Gaps Ranked Descending", `Top gap: ${gapData.gaps[0]?.skillName} (-${gapData.gaps[0]?.gap})`);
    assert(Boolean(gapData.gaps[0]?.tag), "Skill Gap Tagged with Difficulty", `Tag: ${gapData.gaps[0]?.tag}`);

    // 5. Module 4: Recommendation Engine & Linear Learning Path
    const pathRes = await fetch(`${API_BASE}/recommendations/my-path`, { headers: authHeaders });
    const pathData = await pathRes.json();
    assert(pathRes.ok && Array.isArray(pathData.path), "Recommendation Engine Path", `${pathData.totalSteps} steps, ${pathData.estimatedHours} hrs`);
    if (pathData.path.length > 1) {
      assert(pathData.path[0].difficulty === "foundational" || pathData.path[0].difficulty === "intermediate", "Foundational-First Path Ordering", `Step 1 is ${pathData.path[0].difficulty}`);
    }

    // 6. Module 2: Self-Rating Calibration
    const targetSkill = gapData.gaps[0];
    const newRatingLevel = Math.min(5, targetSkill.currentLevel + 1);
    const selfRateRes = await fetch(`${API_BASE}/assessments/self-rate`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        ratings: [{ skillId: targetSkill.skillId, level: newRatingLevel }]
      })
    });
    const selfRateData = await selfRateRes.json();
    assert(selfRateRes.ok, "Assessment: Self-Rating Update", `Calibrated ${targetSkill.skillName} to Level ${newRatingLevel}`);

    // 7. Module 5: AI Quiz Generation via Document Upload
    const sampleFilePath = path.resolve("test_syllabus_chapter.txt");
    fs.writeFileSync(
      sampleFilePath,
      `CHAPTER 4: React Component Architecture and Virtual DOM Mechanics
      React utilizes a declarative paradigm where UI is a pure function of component state.
      The Virtual DOM is a lightweight JavaScript representation of the real browser DOM.
      When state mutates, React renders a new virtual DOM tree and performs a diffing reconciliation algorithm.
      By batching updates and only touching the real DOM nodes that actually changed, React avoids expensive browser layout recalibrations and repaints.
      Hooks like useEffect encapsulate lifecycle side-effects, while useMemo memoizes computationally intensive calculation results across renders.`
    );

    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(sampleFilePath)], { type: "text/plain" });
    formData.append("document", fileBlob, "react_chapter4_notes.txt");
    formData.append("skillId", targetSkill.skillId);
    formData.append("numQuestions", "4");

    const quizGenRes = await fetch(`${API_BASE}/quizzes/generate-from-file`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    const quizGenData = await quizGenRes.json();
    assert(quizGenRes.ok && Boolean(quizGenData.quiz), "AI Quiz Generation from Upload", quizGenData.quiz?.title);
    const createdQuiz = quizGenData.quiz;
    assert(createdQuiz.questions?.length >= 3, "MCQ Question Array Generated", `${createdQuiz.questions?.length} MCQs`);
    const sampleQ = createdQuiz.questions[0];
    let opts = [];
    try { opts = JSON.parse(sampleQ.options); } catch (e) { opts = sampleQ.options; }
    assert(Array.isArray(opts) && opts.length === 4, "MCQ Contains Exactly 4 Options", opts[0]);
    assert(typeof sampleQ.correct_option === "number", "MCQ Has Zero-Based correct_option Index", `Index: ${sampleQ.correct_option}`);
    assert(Boolean(sampleQ.explanation), "MCQ Has Pedagogical Explanation", sampleQ.explanation?.slice(0, 50) + "...");

    // 8. Module 6 & 7: Quiz Taking, Instant Scoring, and SkillProfile Level Update
    const answersPayload = {};
    for (const q of createdQuiz.questions) {
      answersPayload[q.id] = q.correct_option; // Submit all correct answers
    }

    const attemptRes = await fetch(`${API_BASE}/quizzes/${createdQuiz.id}/attempt`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ answers: answersPayload })
    });
    const attemptData = await attemptRes.json();
    assert(attemptRes.ok, "Quiz Attempt Submission & Instant Scoring", `Score: ${attemptData.score}/${attemptData.totalQuestions} (${attemptData.percentage}%)`);
    assert(attemptData.passed === true, "Quiz Attempt Status: Passed", `Passed: ${attemptData.passed}`);
    assert(Boolean(attemptData.updatedSkillLevel), "Progress Update: SkillProfile Promoted", `New Level: ${attemptData.updatedSkillLevel?.level}`);
    assert(Boolean(attemptData.freshGaps), "Dynamic Gap Analysis Recalculated after Scoring");

    // 9. Module 8: Attempt History
    const historyRes = await fetch(`${API_BASE}/quizzes/my-attempts`, { headers: authHeaders });
    const historyData = await historyRes.json();
    assert(Array.isArray(historyData) && historyData.length > 0, "Quiz History Table Telemetry", `${historyData.length} records`);

    // 10. Module 9: Admin Dashboard Analytics (Role Gated)
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@skillsetu.ai", password: "Password123!" })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminHeaders = { "Authorization": `Bearer ${adminLoginData.token}`, "Content-Type": "application/json" };

    const adminAnalyticsRes = await fetch(`${API_BASE}/admin/analytics`, { headers: adminHeaders });
    const adminData = await adminAnalyticsRes.json();
    assert(adminAnalyticsRes.ok, "Admin Analytics API", `Learners: ${adminData.metrics?.totalLearners}, Quizzes: ${adminData.metrics?.totalQuizzes}`);
    assert(Array.isArray(adminData.commonGaps) && adminData.commonGaps.length > 0, "Admin Common Gaps Bar Chart Telemetry", `${adminData.commonGaps.length} gap series`);
    assert(Array.isArray(adminData.trackAverages), "Admin Track Score Averages Telemetry", `${adminData.trackAverages.length} tracks`);

    // Cleanup sample file
    if (fs.existsSync(sampleFilePath)) fs.unlinkSync(sampleFilePath);

    console.log("=========================================================");
    console.log(`🎉 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
    console.log("=========================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("❌ E2E test execution threw an error:", err);
    process.exit(1);
  }
}

runE2ETests();
