import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  COMPETENCY_CATEGORIES,
  COMPETENCIES,
  IGOT_COURSES,
} from "../data/mockData.js";
import {
  Award,
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Shield,
  FileCheck2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LearnerDashboard() {
  const {
    currentUser,
    userCompetencies,
    currentTargetRole,
    enrolledCourses,
    setActiveTab,
    setActiveQuizModal,
    publishedAssessments,
  } = usePlatform();

  // Compute stats
  const competenciesArray = COMPETENCIES.map((c) => ({
    ...c,
    level: userCompetencies[c.id] || 1,
    targetLevel: currentTargetRole.requiredCompetencies[c.id] || 3,
    gap: (userCompetencies[c.id] || 1) - (currentTargetRole.requiredCompetencies[c.id] || 3),
  }));

  const criticalGaps = competenciesArray.filter((c) => c.gap < 0).sort((a, b) => a.gap - b.gap);

  const levelColors = {
    1: "bg-red-50 text-red-700 border-red-200",
    2: "bg-amber-50 text-amber-700 border-amber-200",
    3: "bg-blue-50 text-blue-700 border-blue-200",
    4: "bg-indigo-50 text-indigo-700 border-indigo-200",
    5: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold",
  };

  const levelBadges = {
    1: "L1: Novice",
    2: "L2: Beginner",
    3: "L3: Intermediate",
    4: "L4: Advanced",
    5: "L5: Expert",
  };

  return (
    <div className="space-y-6">
      {/* Official Officer Welcome Header Banner */}
      <div className="bg-white border-l-4 border-[#0B3D91] shadow-xs rounded-r-lg p-5 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#07265D] text-white flex items-center justify-center font-bold text-xl border-2 border-amber-400 shadow-sm flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Official MoSPI Profile
              </span>
              <span className="text-xs text-gray-500">ID: {currentUser.karmayogiId}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif-gov mt-0.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {currentUser.role} • <strong>{currentUser.cadre}</strong> • {currentUser.department}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
              <span>📍 {currentUser.location}</span>
              <span>🎓 {currentUser.qualification}</span>
              <span>⏳ {currentUser.experienceYears} Years Service</span>
            </div>
          </div>
        </div>

        {/* Target Benchmark Quick Card */}
        <div className="bg-blue-50/80 p-3.5 rounded-lg border border-blue-200 w-full md:w-auto min-w-[260px]">
          <div className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
            Target Career Benchmark
          </div>
          <div className="text-sm font-bold text-[#0B3D91] mt-0.5">
            {currentTargetRole.title}
          </div>
          <div className="text-[11px] text-gray-600 mt-1 flex items-center justify-between">
            <span>Identified Skill Gaps:</span>
            <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
              {criticalGaps.length} Competencies
            </span>
          </div>
          <button
            onClick={() => setActiveTab("skillgap")}
            className="mt-2 w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-[11px] font-bold py-1.5 px-2 rounded transition-colors flex items-center justify-center space-x-1"
          >
            <span>Analyze Skill Gap</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B3D91] flex items-center justify-center flex-shrink-0 border border-blue-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{currentUser.learningStats.hoursCompleted} hrs</div>
            <div className="text-[11px] text-gray-500 font-medium">Active Learning Hours</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {Object.keys(enrolledCourses).length} Courses
            </div>
            <div className="text-[11px] text-gray-500 font-medium">iGOT Enrolled Modules</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{currentUser.learningStats.karmayogiCredits}</div>
            <div className="text-[11px] text-gray-500 font-medium">Karmayogi Credits</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 border border-purple-200">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{currentUser.learningStats.assessmentsPassed} Passed</div>
            <div className="text-[11px] text-gray-500 font-medium">Certified Assessments</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Competency Heatmap + Critical Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Competency Heatmap Grid */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
                Competency Heatmap Matrix
              </h3>
              <p className="text-xs text-gray-500">
                Current official proficiency verified across MoSPI competency standards (Levels 1 - 5)
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px]">
              <span className="font-bold text-gray-600">Scale:</span>
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800">L1 Novice</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">L2</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">L3 Inter.</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">L4</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">L5 Expert</span>
            </div>
          </div>

          {/* Grouped by Competency Category */}
          <div className="space-y-4">
            {Object.values(COMPETENCY_CATEGORIES).map((catName) => {
              const catComps = competenciesArray.filter((c) => c.category === catName);
              return (
                <div key={catName} className="border border-gray-100 rounded-md p-3 bg-gray-50/50">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{catName} Domain</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      {catComps.length} skills tracked
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {catComps.map((comp) => (
                      <div
                        key={comp.id}
                        className={`p-2.5 rounded border ${levelColors[comp.level]} transition-all hover:shadow-sm`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                            {comp.code}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/80 border border-current">
                            {levelBadges[comp.level]}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-1 text-gray-900 leading-tight">
                          {comp.name}
                        </div>
                        {/* Gap Indicator */}
                        <div className="mt-2 text-[10px] flex items-center justify-between border-t border-black/10 pt-1">
                          <span className="opacity-80">Req for {currentTargetRole.title.split(" ")[0]}:</span>
                          <span className="font-bold">L{comp.targetLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Top Priority Skill Gaps */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                  Top Priority Skill Gaps
                </h3>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                Target: {currentTargetRole.title.split(" ")[0]}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mb-4">
              Competencies requiring immediate training to qualify for promotional benchmark:
            </p>

            <div className="space-y-3">
              {criticalGaps.slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 bg-red-50/40 rounded-lg border border-red-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <span className="text-red-700 font-extrabold text-[11px] bg-red-100 px-1.5 py-0.2 rounded">
                      Gap: {item.gap}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1">
                    Current: <strong>Level {item.level}</strong> • Required: <strong>Level {item.targetLevel}</strong>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(item.level / item.targetLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("recommendations")}
              className="mt-4 w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bridge Gaps via AI Recommendations</span>
            </button>
          </div>

          {/* Quick Assessment CTA Card */}
          <div className="bg-gradient-to-br from-[#07265D] to-[#0B3D91] text-white rounded-lg p-4 shadow-sm border border-amber-500/40">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4" />
              <span>Ready for Verification?</span>
            </div>
            <h4 className="text-sm font-bold font-serif-gov mt-1 text-white">
              Official Diagnostic Assessments
            </h4>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              Complete accredited 10-15 minute quizzes to test your proficiency and automatically level up your verified competency profile.
            </p>
            <button
              onClick={() => setActiveTab("assessments")}
              className="mt-3 bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-bold py-2 px-3 rounded w-full transition-colors flex items-center justify-center space-x-1"
            >
              <span>Take Live Assessment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Learning Roadmap (Sequenced) */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
              Personalized Learning Roadmap
            </h3>
            <p className="text-xs text-gray-500">
              Sequenced course progression tailored to close identified gaps for {currentTargetRole.title}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("catalogue")}
            className="text-xs text-blue-700 hover:underline font-bold flex items-center space-x-1"
          >
            <span>View Full iGOT Catalogue</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {IGOT_COURSES.slice(0, 3).map((course, idx) => {
            const enrollment = enrolledCourses[course.id];
            const isEnrolled = !!enrollment;
            const progress = enrollment?.progress || 0;
            const isCompleted = enrollment?.status === "completed";

            return (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50/60 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xl">{course.thumbnail}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {course.provider} • {course.durationHours} hrs
                  </div>
                  <div className="text-[11px] text-gray-600 mt-2 line-clamp-2">
                    {course.description}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  {isEnrolled ? (
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-gray-600 font-medium">
                          {isCompleted ? "Completed" : "In Progress"}
                        </span>
                        <span className="font-bold text-blue-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? "bg-green-600" : "bg-blue-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-500 italic">
                      Recommended Next Step
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
