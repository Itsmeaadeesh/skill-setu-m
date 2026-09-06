import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { COMPETENCY_CATEGORIES, COMPETENCIES } from "../data/mockData.js";
import { UserCheck, Sparkles, RefreshCw, CheckCircle2, Shield, Info, ArrowRight } from "lucide-react";

export default function CompetencyProfilePage() {
  const { currentUser, userCompetencies, generateCompetencyProfile, setActiveTab } = usePlatform();

  const [formData, setFormData] = useState({
    designation: currentUser.role,
    cadre: currentUser.cadre,
    department: currentUser.department,
    qualifications: currentUser.qualification,
    experienceYears: currentUser.experienceYears,
    specialization: "Socio-Economic Surveys (PLFS / NSS)",
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationLog, setEvaluationLog] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEvaluating(true);
    setEvaluationLog(["Parsing official cadre parameters...", "Mapping role responsibilities to MoSPI Competency Dictionary...", "Analyzing academic qualification and survey experience weights...", "Formulating verified baseline proficiency levels..."]);

    setTimeout(() => {
      setIsEvaluating(false);
      generateCompetencyProfile(formData);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Official Civil Service Profiling</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            Officer Competency Profiling Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure designation, cadre responsibilities, and experience to generate or update your verified competency profile.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("skillgap")}
          className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 px-3.5 rounded transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <span>Proceed to Skill-Gap Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 font-serif-gov flex items-center justify-between">
            <span>Service & Role Details</span>
            <span className="text-[10px] text-gray-500 font-normal">FRAC Guidelines</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Official Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Cadre / Service Category</label>
              <select
                value={formData.cadre}
                onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                <option value="Non-Cadre Statistical Staff">Non-Cadre Statistical Staff</option>
                <option value="Data Informatics & IT Unit">Data Informatics & IT Unit</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Department / Division</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="Survey Design and Research Division (SDRD)">Survey Design and Research Division (SDRD)</option>
                <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD)</option>
                <option value="Price Statistics Division (PSD)">Price Statistics Division (PSD)</option>
                <option value="Data Quality Assurance Division (DQAD)">Data Quality Assurance Division (DQAD)</option>
                <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                <option value="National Statistical Systems Training Academy (NSSTA)">NSSTA Greater Noida</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Academic & Technical Qualifications</label>
              <input
                type="text"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="e.g. M.Sc. Statistics, Python, SQL"
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Years in Official Service</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="40"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Domain Specialization</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="Socio-Economic Surveys (PLFS / NSS)">Socio-Economic Surveys (PLFS / NSS)</option>
                <option value="National Accounts & GDP Compilation">National Accounts & GDP Compilation</option>
                <option value="Price Statistics (CPI / WPI)">Price Statistics (CPI / WPI)</option>
                <option value="Industrial Statistics (IIP / ASI)">Industrial Statistics (IIP / ASI)</option>
                <option value="Data Engineering & Machine Learning">Data Engineering & Machine Learning</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isEvaluating}
              className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white py-2.5 px-4 rounded font-bold transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-60"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Profile via AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate AI Competency Profile</span>
                </>
              )}
            </button>
          </form>

          {evaluationLog && isEvaluating && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-[11px] text-blue-900 space-y-1 animate-pulse">
              <div className="font-bold text-xs">Rule Engine Execution:</div>
              {evaluationLog.map((log, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <span>✓</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Profile Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                  Verified Skill Matrix
                </h3>
                <p className="text-[11px] text-gray-500">
                  Calibrated against MoSPI Framework for Roles, Activities and Competencies (FRAC)
                </p>
              </div>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded border border-green-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span>Verified in Session</span>
              </span>
            </div>

            <div className="space-y-4">
              {Object.values(COMPETENCY_CATEGORIES).map((catName) => {
                const catComps = COMPETENCIES.filter((c) => c.category === catName);
                return (
                  <div key={catName} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                    <div className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2">
                      {catName} Domain
                    </div>
                    <div className="space-y-2">
                      {catComps.map((comp) => {
                        const level = userCompetencies[comp.id] || 1;
                        return (
                          <div
                            key={comp.id}
                            className="bg-white p-2.5 rounded border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-1 rounded border border-blue-200 font-semibold">
                                  {comp.code}
                                </span>
                                <span className="text-xs font-bold text-gray-900">{comp.name}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {comp.levelDescriptions[level]}
                              </p>
                            </div>

                            <div className="flex items-center space-x-3 self-end sm:self-center">
                              <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                Level {level} / 5
                              </span>
                              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#0B3D91] h-full rounded-full"
                                  style={{ width: `${(level / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
