import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  MOCK_DOCUMENTS,
  QUESTION_BANK,
  COMPETENCIES,
} from "../data/mockData.js";
import {
  FileUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  Send,
  Clock,
  Play,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function AssessmentEnginePage() {
  const {
    role,
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
    setActiveQuizModal,
  } = usePlatform();

  const [simulatedFileName, setSimulatedFileName] = useState("");
  const [editingQId, setEditingQId] = useState(null);
  const [editStem, setEditStem] = useState("");
  const [quizTitleInput, setQuizTitleInput] = useState("");

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    if (!simulatedFileName.trim()) return;

    const newDoc = {
      id: "doc-" + Date.now(),
      name: simulatedFileName.endsWith(".pdf") ? simulatedFileName : `${simulatedFileName}.pdf`,
      size: "3.4 MB",
      pages: 94,
      domain: "National Accounts & Official Statistics",
      uploadDate: new Date().toISOString().split("T")[0],
      topics: ["SNA Framework", "GVA Compilation", "Data Validation"],
      suggestedQuestionsCount: 6,
    };

    triggerAIGeneration(newDoc);
    setSimulatedFileName("");
  };

  const startEdit = (q) => {
    setEditingQId(q.id);
    setEditStem(q.question);
  };

  const saveEdit = (qId) => {
    editQuestion(qId, { question: editStem });
    setEditingQId(null);
  };

  const stepperTitles = [
    "Upload Document",
    "Text & Schema Extraction",
    "Semantic Segmentation",
    "MCQ Item Generation",
    "Psychometric Validation",
    "Trainer Review & Publish",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0B3D91] uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4 text-amber-500" />
            <span>AI Intelligent Assessment Engine</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            {role === "trainer"
              ? "NSSTA Assessment Generation & Review Studio"
              : "MoSPI Official Competency Assessments Hub"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {role === "trainer"
              ? "Upload MoSPI training manuals or policy documents to automatically synthesize psychometrically validated MCQs."
              : "Take certified diagnostic assessments to benchmark your competency levels and unlock verified credentials."}
          </p>
        </div>

        <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Active Role: {role === "trainer" ? "Trainer / Author" : "Official Learner"}</span>
        </div>
      </div>

      {/* TRAINER STUDIO VIEW */}
      {role === "trainer" && (
        <div className="space-y-6">
          {/* Document Upload & Progress Stepper */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov mb-3">
              1. Document Ingestion & AI Question Generation Pipeline
            </h3>

            {/* Simulated File Upload Form */}
            <form onSubmit={handleSimulateUpload} className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <div className="relative flex-1 w-full">
                <FileUp className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={simulatedFileName}
                  onChange={(e) => setSimulatedFileName(e.target.value)}
                  placeholder="e.g. MoSPI_CPI_Methodology_Revision_2026.pdf"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={generatingStep > 0 && generatingStep < 5}
                className="w-full sm:w-auto bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 px-4 rounded transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Trigger AI Ingestion Pipeline</span>
              </button>
            </form>

            {/* Existing Preset Manuals Quick Buttons */}
            <div className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
              <span className="font-bold text-gray-500">Or Select Sample Manual:</span>
              {MOCK_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => triggerAIGeneration(doc)}
                  className="bg-blue-50 hover:bg-blue-100 text-[#0B3D91] border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                >
                  {doc.name}
                </button>
              ))}
            </div>

            {/* Stepper Progress Bar */}
            <div className="border-t border-gray-200 pt-5">
              <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>AI Pipeline Stepper</span>
                <span className="text-blue-900 font-bold">
                  {generatingStep === 0
                    ? "Ready to run"
                    : generatingStep === 5
                    ? "Step 5/5: Ready for Trainer Review"
                    : `Step ${generatingStep}/5: Processing...`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((s) => {
                  const isDone = generatingStep >= s;
                  const isCurrent = generatingStep === s && generatingStep < 5;

                  return (
                    <div
                      key={s}
                      className={`p-2.5 rounded border text-center transition-all ${
                        isDone
                          ? "bg-blue-50 border-blue-500 text-blue-950"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase">
                        {isCurrent ? "⚙️ Running" : isDone ? "✓ Done" : `Step ${s}`}
                      </div>
                      <div className="text-[11px] font-bold mt-1 text-gray-900">
                        {stepperTitles[s]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trainer Review & Approval Screen */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-200 gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                  2. Trainer Review Screen (Approve / Edit / Reject Generated Items)
                </h3>
                <p className="text-xs text-gray-500">
                  Synthesized items derived from: <strong>{selectedDoc.name}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={quizTitleInput}
                  onChange={(e) => setQuizTitleInput(e.target.value)}
                  placeholder="Official Test Title"
                  className="border border-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none"
                />
                <button
                  onClick={() => publishGeneratedQuiz(quizTitleInput)}
                  className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Publish to Bank</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold bg-[#07265D] text-white px-2 py-0.5 rounded">
                        Item #{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-900">
                        {q.competencyName}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ({q.difficulty})
                      </span>
                    </div>

                    {/* Trainer Controls */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => startEdit(q)}
                        className="text-gray-600 hover:text-blue-700 p-1 text-[11px] font-semibold flex items-center space-x-1 rounded bg-white border border-gray-300"
                        title="Edit question text"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => approveQuestion(q.id)}
                        className={`p-1 text-[11px] font-bold flex items-center space-x-1 rounded border ${
                          q.approved
                            ? "bg-green-600 text-white border-green-700"
                            : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                        }`}
                        title="Approve Question"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{q.approved ? "Approved" : "Approve"}</span>
                      </button>
                      <button
                        onClick={() => rejectQuestion(q.id)}
                        className="text-red-600 hover:bg-red-50 p-1 text-[11px] font-semibold flex items-center space-x-1 rounded bg-white border border-red-300"
                        title="Reject Question"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Stem */}
                  {editingQId === q.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editStem}
                        onChange={(e) => setEditStem(e.target.value)}
                        className="w-full p-2 border border-blue-400 rounded text-xs focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingQId(null)}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(q.id)}
                          className="bg-[#0B3D91] text-white text-xs px-2.5 py-1 rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      {q.question}
                    </p>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded border text-xs flex items-center space-x-2 ${
                          oIdx === q.correctAnswer
                            ? "bg-green-50 border-green-300 text-green-900 font-semibold"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        <span className="font-bold text-[10px] w-4">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt}</span>
                        {oIdx === q.correctAnswer && (
                          <span className="text-[10px] text-green-700 ml-auto font-bold">
                            (Key)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Psychometric Explanation & Source */}
                  <div className="mt-2.5 p-2 bg-blue-50/60 rounded border border-blue-100 text-[11px] text-gray-600">
                    <strong className="text-blue-900">Psychometric Rationale: </strong>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEARNER & COMMON VIEW: AVAILABLE LIVE ASSESSMENTS */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
              Available Live Diagnostic Assessments
            </h3>
            <p className="text-xs text-gray-500">
              Interactive assessments officially accredited by NSSTA Greater Noida
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-900 px-2.5 py-1 rounded font-bold border border-blue-200">
            {publishedAssessments.length} Assessments Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {publishedAssessments.map((test) => (
            <div
              key={test.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white hover:border-[#0B3D91] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{test.timeLimitMinutes} Mins</span>
                  </span>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-green-300">
                    Pass: {test.passingScore}%
                  </span>
                </div>

                <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                  {test.title}
                </h4>
                <div className="text-[11px] text-blue-900 font-semibold mt-1">
                  Topic: {test.topic}
                </div>

                <div className="mt-3 text-[11px] text-gray-500 space-y-1">
                  <div>Questions: <strong>{test.questions.length} Items</strong></div>
                  <div>Attempts: <strong>{test.attemptsCount} Officials</strong></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() =>
                    setActiveQuizModal({
                      isOpen: true,
                      assessment: test,
                    })
                  }
                  className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
