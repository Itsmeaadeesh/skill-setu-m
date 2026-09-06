import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Shield,
  Layers,
  Award
} from "lucide-react";

export default function LearnerOnboardingPage() {
  const { currentUser, completeLearnerOnboarding } = usePlatform();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: currentUser.name || "Aadeesh Sharma",
    designation: currentUser.role || "Junior Statistical Officer (JSO)",
    cadre: currentUser.cadre || "Subordinate Statistical Service (SSS)",
    department: currentUser.department || "Survey Design and Research Division (SDRD)",
    location: currentUser.location || "Kolkata, West Bengal",
    experienceYears: currentUser.experienceYears || 4.5,
    qualification: currentUser.qualification || "M.Sc. in Statistics (University of Calcutta)",
    selfRatings: {
      "comp-stat-1": 3,
      "comp-stat-2": 2,
      "comp-stat-3": 2,
      "comp-tech-1": 2,
      "comp-tech-2": 2,
      "comp-tech-3": 2,
      "comp-tech-4": 1,
      "comp-tech-5": 1,
      "comp-gov-1": 2,
    },
    completedTrainings: [
      "Foundation Course in Official Statistics (NSSTA)",
      "Computer Assisted Personal Interviewing (CAPI) on Tablets"
    ],
    focusSkills: [
      "Python Survey Automation",
      "National Accounts Rebasing & GVA",
      "Geospatial & Remote Sensing Analytics"
    ]
  });

  const availableSkills = [
    "Python Survey Automation",
    "National Accounts Rebasing & GVA",
    "Geospatial & Remote Sensing Analytics",
    "Machine Learning for Imputation",
    "Big Data & High-Frequency Indicators",
    "Price Index & CPI Automation",
    "DPDP Act & Microdata Anonymization",
    "R for Small Area Estimation"
  ];

  const pastTrainingOptions = [
    "Foundation Course in Official Statistics (NSSTA)",
    "Computer Assisted Personal Interviewing (CAPI) on Tablets",
    "Advanced Sampling Methodologies & Multi-Stage Design",
    "System of National Accounts (SNA 2008 & 2025)",
    "Cyber Security & Data Protection in GoI",
    "Spatial Analytics with QGIS & Remote Sensing"
  ];

  const competencyLabels = [
    { id: "comp-stat-1", name: "Survey Sampling & Estimation", desc: "Stratification, Multipliers, Calibration Weighting" },
    { id: "comp-stat-2", name: "National Accounts & GVA", desc: "SNA 2008, GVA Compilation, Supply-Use Tables" },
    { id: "comp-stat-3", name: "Price Statistics & Indices", desc: "CPI, WPI, Jevons/Laspeyres index compilation" },
    { id: "comp-tech-1", name: "Python for Survey Automation", desc: "Pandas, NumPy, automated data wrangling" },
    { id: "comp-tech-2", name: "R Statistical Computing", desc: "Sampling packages, variance estimation" },
    { id: "comp-tech-3", name: "SQL & Data Scrutiny", desc: "Relational queries, outlier anomaly detection" },
    { id: "comp-tech-4", name: "GIS & Geospatial Analysis", desc: "Delineating Enumeration Blocks, QGIS maps" },
    { id: "comp-tech-5", name: "AI & Machine Learning", desc: "Predictive imputation, automated classification" },
    { id: "comp-gov-1", name: "DPDP Act & Data Privacy", desc: "K-anonymity, microdata governance, Section 17" },
  ];

  const toggleFocusSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.focusSkills.includes(skill);
      return {
        ...prev,
        focusSkills: exists ? prev.focusSkills.filter((s) => s !== skill) : [...prev.focusSkills, skill]
      };
    });
  };

  const togglePastTraining = (training) => {
    setFormData((prev) => {
      const exists = prev.completedTrainings.includes(training);
      return {
        ...prev,
        completedTrainings: exists ? prev.completedTrainings.filter((t) => t !== training) : [...prev.completedTrainings, training]
      };
    });
  };

  const handleRatingChange = (compId, val) => {
    setFormData((prev) => ({
      ...prev,
      selfRatings: {
        ...prev.selfRatings,
        [compId]: Number(val)
      }
    }));
  };

  const handleFinish = () => {
    completeLearnerOnboarding(formData);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Onboarding Top Gov Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Mission Karmayogi • FRAC Onboarding Wizard</span>
              </div>
              <h1 className="text-2xl font-bold font-serif-gov text-gray-900 mt-1">
                Civil Service Officer Competency Profiling
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Calibrate your verified baseline competencies and personalize your AI learning path across MoSPI Six Hubs.
              </p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-[#0B3D91] text-white shadow-md ring-2 ring-blue-300"
                      : step > s
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Step {step} of 4: {step === 1 ? "Personal & Service Details" : step === 2 ? "Educational & Technical Background" : step === 3 ? "Past Trainings & Focus Interests" : "Review & Calibration"}</span>
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
            >
              Skip to Default Calibration →
            </button>
          </div>
        </div>

        {/* STEP 1: Personal & Service Details */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-5 animate-in fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-[#0B3D91]" />
                <span>Step 1: Service & Designation Parameters</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official service details determine your target cadre benchmarks and promotional pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Official Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Designation</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                  <option value="Statistical Investigator Gr-II">Statistical Investigator Gr-II</option>
                  <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                  <option value="Assistant Director (ISS)">Assistant Director (ISS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Cadre Classification</label>
                <select
                  value={formData.cadre}
                  onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                  <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                  <option value="Non-Cadre Statistical Staff">Non-Cadre Statistical Staff</option>
                  <option value="IT & Systems Cadre">IT & Systems Cadre</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Department / Division</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Survey Design and Research Division (SDRD)">Survey Design and Research Division (SDRD)</option>
                  <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                  <option value="Price Statistics Division (PSD)">Price Statistics Division (PSD)</option>
                  <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                  <option value="Data Quality Assurance Division (DQAD)">Data Quality Assurance Division (DQAD)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Current Posting Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Kolkata, West Bengal"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Total Years in Service</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Qualifications</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Educational & Technical Background */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-5 animate-in fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#0B3D91]" />
                <span>Step 2: Educational Qualifications & Technical Self-Rating</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Rate your baseline proficiency across key MoSPI competencies (Level 1: Beginner to Level 5: Expert).
              </p>
            </div>

            <div className="text-xs mb-4">
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Highest Academic Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                Competency Proficiency Self-Assessment:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competencyLabels.map((c) => {
                  const currentVal = formData.selfRatings[c.id] || 2;
                  return (
                    <div key={c.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">{c.name}</span>
                          <span className="text-xs font-bold text-[#0B3D91] bg-blue-100 px-2 py-0.5 rounded">
                            Level {currentVal}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{c.desc}</p>
                      </div>

                      <div className="mt-3 flex items-center space-x-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={currentVal}
                          onChange={(e) => handleRatingChange(c.id, e.target.value)}
                          className="flex-1 accent-[#0B3D91] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 w-12 text-right font-mono">
                          L{currentVal}/5
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Focus Interests</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Past Trainings & Focus Interests */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6 animate-in fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Step 3: Past Trainings & Priority Learning Interests</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Skills you choose here directly drive the AI Recommendation Engine and Semantic Match scoring!
              </p>
            </div>

            {/* Target Skills to Focus On */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                ★ Which statistical / technical skills do you want to master next? (Real Recommendation Input):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = formData.focusSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleFocusSkill(skill)}
                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-[#0B3D91] text-[#0B3D91] shadow-xs"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0B3D91] flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completed Trainings Checklist */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Previously Completed Trainings & Certifications:
              </label>
              <div className="space-y-2 text-xs">
                {pastTrainingOptions.map((t) => {
                  const checked = formData.completedTrainings.includes(t);
                  return (
                    <label
                      key={t}
                      className="flex items-center space-x-2.5 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePastTraining(t)}
                        className="rounded text-[#0B3D91] focus:ring-blue-500"
                      />
                      <span className={checked ? "font-semibold text-gray-900" : "text-gray-600"}>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Review & Calibrate</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Generate */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6 animate-in fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Step 4: Review Parameters & Calibrate Competencies</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                The MoSPI rule engine will synthesize your inputs, apply experience weighting, and initialize your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="font-bold text-[#0B3D91] uppercase tracking-wider text-[11px]">Official Service Summary</div>
                <div><strong className="text-gray-700">Official Name:</strong> {formData.name}</div>
                <div><strong className="text-gray-700">Designation:</strong> {formData.designation}</div>
                <div><strong className="text-gray-700">Cadre:</strong> {formData.cadre}</div>
                <div><strong className="text-gray-700">Division:</strong> {formData.department}</div>
                <div><strong className="text-gray-700">Posting Location:</strong> {formData.location}</div>
                <div><strong className="text-gray-700">Experience:</strong> {formData.experienceYears} Years</div>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2">
                <div className="font-bold text-[#0B3D91] uppercase tracking-wider text-[11px]">Priority Learning Focus</div>
                <div className="text-gray-600">These skills will immediately receive highest Semantic Match scores:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.focusSkills.map((s) => (
                    <span key={s} className="bg-white text-blue-900 border border-blue-300 px-2 py-0.5 rounded text-[11px] font-bold">
                      ★ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-xs text-emerald-900 flex items-start space-x-3">
              <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Automated Calibration Ready</div>
                <div className="text-[11px] mt-0.5 text-emerald-800">
                  Upon submission, your baseline ratings are calibrated with qualification weightings and your 4.5 years of service. Your personal iGOT Roadmap and NSSTA TPAC nominations will unlock immediately.
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate My Competency Profile & Enter Hub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
