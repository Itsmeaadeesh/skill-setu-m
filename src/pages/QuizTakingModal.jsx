import React, { useState, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Award,
  X,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function QuizTakingModal() {
  const { activeQuizModal, setActiveQuizModal, completeQuiz } = usePlatform();

  if (!activeQuizModal.isOpen || !activeQuizModal.assessment) return null;

  const assessment = activeQuizModal.assessment;
  const questions = assessment.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(assessment.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Computerized Adaptive Testing (CAT) dynamic tracking
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState("Medium");
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [adaptiveShiftNotice, setAdaptiveShiftNotice] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    const isAnsCorrect = optIndex === questions[currentIndex]?.correctAnswer;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optIndex,
    });

    // Adaptive Branching Logic
    if (isAnsCorrect) {
      const nextStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextStreak);
      setConsecutiveWrong(0);

      if (nextStreak >= 2 && adaptiveDifficulty !== "Hard") {
        setAdaptiveDifficulty("Hard");
        setAdaptiveShiftNotice("Difficulty Adapted: ↑ Advanced Analytical Items Activated (+1 Difficulty)");
        setTimeout(() => setAdaptiveShiftNotice(null), 3500);
      }
    } else {
      const nextWrong = consecutiveWrong + 1;
      setConsecutiveWrong(nextWrong);
      setConsecutiveCorrect(0);

      if (nextWrong >= 2 && adaptiveDifficulty !== "Easy") {
        setAdaptiveDifficulty("Easy");
        setAdaptiveShiftNotice("Difficulty Adapted: ↓ Foundational Methodological Items Activated (-1 Difficulty)");
        setTimeout(() => setAdaptiveShiftNotice(null), 3500);
      }
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setScoreResult({
      score: correctCount,
      total: questions.length,
      percentage: percent,
      passed: percent >= assessment.passingScore,
    });
    setIsSubmitted(true);

    completeQuiz(assessment, percent, correctCount, questions.length);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const handleClose = () => {
    setActiveQuizModal({ isOpen: false, assessment: null });
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0B3D91] max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Test Header */}
        <div className="bg-[#07265D] text-white p-4 border-b-2 border-amber-500 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                NSSTA Computerized Adaptive Testing (CAT)
              </span>
              <span
                className={`text-[9px] px-2 py-0.2 rounded-full font-bold uppercase flex items-center space-x-1 ${
                  adaptiveDifficulty === "Hard"
                    ? "bg-red-500 text-white"
                    : adaptiveDifficulty === "Easy"
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {adaptiveDifficulty === "Hard" && <TrendingUp className="w-2.5 h-2.5" />}
                {adaptiveDifficulty === "Easy" && <TrendingDown className="w-2.5 h-2.5" />}
                <span>Difficulty: {adaptiveDifficulty}</span>
              </span>
            </div>
            <h3 className="text-base font-bold font-serif-gov text-white truncate max-w-md mt-0.5">
              {assessment.title}
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            {!isSubmitted && (
              <div className="flex items-center space-x-1.5 bg-[#0B3D91] px-3 py-1 rounded-full border border-blue-600 font-mono text-xs font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Adaptive Dynamic Shift Alert Pill */}
        {adaptiveShiftNotice && (
          <div className="bg-amber-100 text-amber-950 border-b border-amber-300 text-xs py-1.5 px-4 font-bold flex items-center justify-center space-x-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{adaptiveShiftNotice}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F8FAFC]">
          {/* RESULTS VIEW */}
          {isSubmitted ? (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-xl border text-center ${
                  scoreResult.passed
                    ? "bg-green-50 border-green-300 text-green-950"
                    : "bg-amber-50 border-amber-300 text-amber-950"
                }`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-white shadow-xs">
                  {scoreResult.passed ? (
                    <Award className="w-7 h-7 text-green-600" />
                  ) : (
                    <AlertCircle className="w-7 h-7 text-amber-600" />
                  )}
                </div>
                <h4 className="text-xl font-bold font-serif-gov">
                  {scoreResult.passed ? "Assessment Passed!" : "Assessment Needs Review"}
                </h4>
                <div className="text-3xl font-extrabold my-2">
                  {scoreResult.score} / {scoreResult.total} ({scoreResult.percentage}%)
                </div>
                <p className="text-xs max-w-md mx-auto text-gray-600">
                  {scoreResult.passed
                    ? "Official verification benchmark achieved. Your verified competency index has been upgraded in the central database."
                    : "The passing threshold for this MoSPI assessment is " +
                      assessment.passingScore +
                      "%. Please review the explanations below."}
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-sm text-[#0B3D91] border-b pb-1 font-serif-gov">
                  Detailed Solution & Psychometric Review
                </h5>
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border text-xs ${
                        isCorrect
                          ? "bg-green-50/40 border-green-200"
                          : "bg-red-50/40 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between font-bold mb-2">
                        <span className="text-gray-900">
                          {idx + 1}. {q.question}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, oIdx) => {
                          const isKey = oIdx === q.correctAnswer;
                          const isUserChoice = oIdx === userAnswer;

                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded border text-[11px] ${
                                isKey
                                  ? "bg-green-100 border-green-400 font-bold text-green-900"
                                  : isUserChoice
                                  ? "bg-red-100 border-red-400 text-red-900"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isKey && <span className="ml-1 text-green-800 font-bold">(Key)</span>}
                              {isUserChoice && !isKey && (
                                <span className="ml-1 text-red-800 font-bold">(Your Answer)</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-2.5 p-2 bg-white rounded border border-gray-200 text-gray-700 text-[11px] leading-relaxed">
                        <strong className="text-blue-900">MoSPI Methodology Note: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ACTIVE TEST TAKING VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center space-x-1.5 overflow-x-auto">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-[#0B3D91] text-white ring-2 ring-amber-400"
                            : isAnswered
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Stem */}
              {currentQ && (
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B3D91] uppercase tracking-wider">
                      Item {currentIndex + 1}
                    </span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                      Adaptive Level: {adaptiveDifficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 leading-snug">
                    {currentQ.question}
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswers[currentIndex] === optIndex;
                      return (
                        <div
                          key={optIndex}
                          onClick={() => handleSelectOption(optIndex)}
                          className={`p-3 rounded-lg border cursor-pointer text-xs transition-all flex items-center space-x-3 ${
                            isSelected
                              ? "border-[#0B3D91] bg-blue-50/80 font-bold text-blue-900 ring-2 ring-blue-600"
                              : "border-gray-200 hover:bg-gray-50 text-gray-800"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                              isSelected
                                ? "bg-[#0B3D91] text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
          {isSubmitted ? (
            <button
              onClick={handleClose}
              className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2.5 rounded transition-colors"
            >
              Close & Return to Learning Hub
            </button>
          ) : (
            <>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 rounded border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="bg-[#0B3D91] hover:bg-[#07265D] text-white px-4 py-1.5 rounded text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-1.5 rounded text-xs font-bold flex items-center space-x-1 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Test</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
