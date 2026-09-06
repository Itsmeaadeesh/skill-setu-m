import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  QUESTION_BANK,
  MOCK_DOCUMENTS,
  COMPETENCIES,
} from "../data/mockData.js";
import {
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  Edit3,
  PlusCircle,
  Upload,
  BookOpen,
  Award,
  Layers,
  Send,
  Eye,
  BarChart3,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function TrainerStudioPage() {
  const {
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
    currentUser,
    activeHub,
    setActiveHub,
  } = usePlatform();

  const [activeStudioTab, setActiveStudioTab] = useState("pipeline"); // 'pipeline' | 'manual' | 'published'
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newQuizTitle, setNewQuizTitle] = useState("");

  // Manual MCQ builder state
  const [manualTitle, setManualTitle] = useState("");
  const [manualTopic, setManualTopic] = useState("National Statistical Accounts");
  const [manualTime, setManualTime] = useState(15);
  const [manualPassing, setManualPassing] = useState(60);
  const [manualQuestionText, setManualQuestionText] = useState("");
  const [manualOptions, setManualOptions] = useState(["", "", "", ""]);
  const [manualCorrectIdx, setManualCorrectIdx] = useState(0);
  const [manualExplanation, setManualExplanation] = useState("");
  const [manualQuestionsList, setManualQuestionsList] = useState([]);

  const handleAddManualQuestion = () => {
    if (!manualQuestionText.trim()) return;
    const newQ = {
      id: "mq-" + Date.now(),
      question: manualQuestionText,
      options: [...manualOptions],
      correctAnswerIndex: manualCorrectIdx,
      explanation: manualExplanation || "Standard NSSTA syllabus evaluation criterion.",
      difficulty: "Medium",
      competencyId: "comp-stat-1",
    };
    setManualQuestionsList((prev) => [...prev, newQ]);
    setManualQuestionText("");
    setManualOptions(["", "", "", ""]);
    setManualExplanation("");
  };

  const handlePublishManualQuiz = () => {
    if (!manualTitle || manualQuestionsList.length === 0) return;
    authorManualAssessment({
      title: manualTitle,
      topic: manualTopic,
      timeLimitMinutes: Number(manualTime),
      passingScore: Number(manualPassing),
      questions: manualQuestionsList,
      competencyIds: ["comp-stat-1", "comp-stat-2"],
    });
    setManualTitle("");
    setManualQuestionsList([]);
    setActiveStudioTab("published");
  };

  const startEdit = (q) => {
    setEditingQuestionId(q.id);
    setEditFormData({
      question: q.question,
      explanation: q.explanation,
      difficulty: q.difficulty,
    });
  };

  const saveEdit = (qId) => {
    editQuestion(qId, editFormData);
    setEditingQuestionId(null);
  };

  const stepsList = [
    { num: 1, label: "Document Parsing & AST Extraction" },
    { num: 2, label: "Semantic Segmentation & FRAC Mapping" },
    { num: 3, label: "Psychometric Item Drafting" },
    { num: 4, label: "Difficulty Discrimination Tuning" },
    { num: 5, label: "NSSTA Faculty Review Ready" },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>National Statistical Systems Training Academy (NSSTA) Faculty Portal</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Content & Assessment Authoring Studio
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transform training manuals into accredited assessments via GenAI extraction pipeline or author custom items directly.
          </p>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveStudioTab("pipeline")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeStudioTab === "pipeline"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-700 hover:text-black"
            }`}
          >
            AI Generator Pipeline
          </button>
          <button
            onClick={() => setActiveStudioTab("manual")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeStudioTab === "manual"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Manual Item Builder
          </button>
          <button
            onClick={() => setActiveStudioTab("published")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeStudioTab === "published"
                ? "bg-[#0B3D91] text-white shadow-xs"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Published ({publishedAssessments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: AI GENERATOR PIPELINE */}
      {activeStudioTab === "pipeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Source Documents */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                Accredited Source Documents
              </h2>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                {uploadedDocs.length} Manuals
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Select a ministry publication or survey guide to trigger the 5-step psychometric extraction engine.
            </p>

            <div className="space-y-3">
              {uploadedDocs.map((doc) => {
                const isSelected = selectedDoc.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => triggerAIGeneration(doc)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0B3D91] bg-blue-50/70 shadow-xs ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-blue-400 bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? "text-[#0B3D91]" : "text-gray-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {doc.domain} • {doc.pages} pages
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px]">
                          <span className="text-amber-700 font-semibold">
                            Est. {doc.suggestedQuestionsCount} MCQs
                          </span>
                          <span className="text-blue-700 font-bold hover:underline">
                            Generate &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Two Columns: Stepper & Question Review Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stepper Progress Visualizer */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>GenAI Synthesis Progress: {selectedDoc?.name}</span>
                </h3>
                <span className="text-xs font-bold text-blue-900">
                  {generatingStep === 5 ? "100% Ready" : generatingStep > 0 ? `Step ${generatingStep}/5` : "Idle"}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {stepsList.map((st) => {
                  const isDone = generatingStep >= st.num;
                  const isCurrent = generatingStep === st.num;
                  return (
                    <div
                      key={st.num}
                      className={`p-2 rounded border text-center transition-all ${
                        isCurrent
                          ? "bg-amber-50 border-amber-400 ring-1 ring-amber-400"
                          : isDone
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className={`text-xs font-bold ${isCurrent ? "text-amber-800" : isDone ? "text-emerald-800" : "text-gray-400"}`}>
                        Step 0{st.num}
                      </div>
                      <div className="text-[9px] text-gray-600 mt-0.5 line-clamp-2 leading-tight">
                        {st.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated Item Review Queue */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                    NSSTA Faculty Review Queue ({generatedQuestions.length} Items)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Inspect options, modify distractors, approve valid questions, and publish directly to iGOT.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder={`Assessment: ${selectedDoc.domain}`}
                    className="text-xs border border-gray-300 rounded px-2.5 py-1.5 w-52"
                  />
                  <button
                    onClick={() => publishGeneratedQuiz(newQuizTitle)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Quiz</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, qIndex) => {
                  const isEditing = editingQuestionId === q.id;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border transition-all ${
                        q.approved
                          ? "border-emerald-300 bg-emerald-50/30"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold text-blue-900">
                              Q0{qIndex + 1}.
                            </span>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded">
                              {q.difficulty}
                            </span>
                            {q.approved && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                                <CheckCircle className="w-3 h-3" />
                                <span>Approved</span>
                              </span>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2 mt-2">
                              <textarea
                                value={editFormData.question}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, question: e.target.value })
                                }
                                className="w-full text-xs border border-gray-300 rounded p-2"
                                rows={2}
                              />
                              <textarea
                                value={editFormData.explanation}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, explanation: e.target.value })
                                }
                                placeholder="Official syllabus explanation"
                                className="w-full text-xs border border-gray-300 rounded p-2"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => saveEdit(q.id)}
                                  className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingQuestionId(null)}
                                  className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-xs font-bold text-gray-900 leading-snug">
                                {q.question}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                                {q.options.map((opt, optIdx) => {
                                  const isCorrect = optIdx === q.correctAnswerIndex;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded border text-[11px] ${
                                        isCorrect
                                          ? "border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold"
                                          : "border-gray-200 bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      <span className="font-mono font-bold mr-1.5">
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-2.5 text-[11px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                <strong>Faculty Key:</strong> {q.explanation}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col space-y-1.5 flex-shrink-0">
                          <button
                            onClick={() => approveQuestion(q.id)}
                            className="p-1.5 rounded hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Approve Item"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEdit(q)}
                            className="p-1.5 rounded hover:bg-blue-100 text-blue-700 transition-colors"
                            title="Edit Item"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => rejectQuestion(q.id)}
                            className="p-1.5 rounded hover:bg-red-100 text-red-700 transition-colors"
                            title="Discard Item"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL ITEM BUILDER */}
      {activeStudioTab === "manual" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
              Author Assessment from Scratch
            </h2>
            <p className="text-xs text-gray-500">
              Create bespoke evaluation tests for MoSPI induction courses or specialized division training.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assessment Title</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g., SDRD Field Operations Quality Check 2026"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Domain / Division</label>
                  <select
                    value={manualTopic}
                    onChange={(e) => setManualTopic(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    <option>Survey Design (SDRD)</option>
                    <option>National Accounts (NAD)</option>
                    <option>Price Statistics (PSD)</option>
                    <option>Field Operations (FOD)</option>
                    <option>Digital Governance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time (Mins)</label>
                  <input
                    type="number"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pass Mark (%)</label>
                  <input
                    type="number"
                    value={manualPassing}
                    onChange={(e) => setManualPassing(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Add Question Item</h3>
                <label className="block font-semibold text-gray-700 mb-1">Question Stem</label>
                <textarea
                  value={manualQuestionText}
                  onChange={(e) => setManualQuestionText(e.target.value)}
                  placeholder="Enter statistical problem statement or policy rule..."
                  className="w-full border border-gray-300 rounded p-2"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">4 Multiple Choice Options (Select Correct Answer)</label>
                {manualOptions.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={manualCorrectIdx === i}
                      onChange={() => setManualCorrectIdx(i)}
                    />
                    <span className="font-mono font-bold">{String.fromCharCode(65 + i)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...manualOptions];
                        newOpts[i] = e.target.value;
                        setManualOptions(newOpts);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official Rationale / Reference</label>
                <input
                  type="text"
                  value={manualExplanation}
                  onChange={(e) => setManualExplanation(e.target.value)}
                  placeholder="e.g., Reference: NSS Manual of Instructions Volume 1"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <button
                type="button"
                onClick={handleAddManualQuestion}
                className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>Add Item to Quiz Draft</span>
              </button>
            </div>
          </div>

          {/* Draft Preview & Publish */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Live Quiz Draft ({manualQuestionsList.length} Items)
                  </h2>
                  <p className="text-xs text-gray-500">
                    {manualTitle || "Untitled Assessment"} • {manualTopic}
                  </p>
                </div>
                {manualQuestionsList.length > 0 && (
                  <button
                    onClick={handlePublishManualQuiz}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Assessment</span>
                  </button>
                )}
              </div>

              {manualQuestionsList.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No questions added yet. Use the authoring form on the left to add items.
                </div>
              ) : (
                <div className="space-y-3 mt-4 max-h-[500px] overflow-y-auto pr-1">
                  {manualQuestionsList.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded border border-gray-200 bg-gray-50/50 text-xs">
                      <div className="font-bold text-gray-900">
                        Q{idx + 1}. {q.question}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`p-1.5 rounded text-[11px] ${
                              oi === q.correctAnswerIndex
                                ? "bg-emerald-100 text-emerald-900 font-bold"
                                : "bg-white text-gray-600 border border-gray-200"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISHED ASSESSMENTS */}
      {activeStudioTab === "published" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-[#0B3D91] font-serif-gov mb-1">
              All Published Assessments on iGOT Platform
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Live assessments accessible by civil servants with active attempt telemetry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {publishedAssessments.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-500 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                      <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {a.topic}
                      </span>
                      <span>⏱ {a.timeLimitMinutes} Mins</span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 mt-2 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      By <strong>{a.author}</strong> • {a.questions?.length || 5} Questions
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold">
                      {a.attemptsCount} Officials Attempted
                    </span>
                    <span className="text-gray-500 font-medium">
                      Pass: {a.passingScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
