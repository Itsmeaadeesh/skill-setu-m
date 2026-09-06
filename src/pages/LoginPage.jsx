import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  BookOpen,
  Award,
  Briefcase,
  MessagesSquare,
  Users,
  Calendar,
  AlertCircle,
  Key
} from "lucide-react";

export default function LoginPage() {
  const { login, loginWithParichay, addToast } = usePlatform();
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = login(emailOrId, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error);
      }
    }, 300);
  };

  const handleQuickLogin = (email, pwd) => {
    setEmailOrId(email);
    setPassword(pwd);
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      login(email, pwd);
      setIsLoading(false);
    }, 200);
  };

  const handleForgotPassword = () => {
    addToast(
      "Password Recovery Initiated",
      "Password reset link dispatched to registered NIC email server (@nic.in / @mospi.gov.in).",
      "info"
    );
  };

  const hubs = [
    { name: "Learn Hub", icon: BookOpen, desc: "Self-paced iGOT modules, NSSTA TPAC tracks & Virtual Labs" },
    { name: "Competency Hub", icon: Award, desc: "FRAC 4-domain profiling & AI skill gap radar matrix" },
    { name: "Career Hub", icon: Briefcase, desc: "Cadre hierarchy ladders & promotion benchmarks" },
    { name: "Discuss Hub", icon: MessagesSquare, desc: "Division-filtered peer forums with NSSTA SME flairs" },
    { name: "Network Hub", icon: Users, desc: "Nationwide directory of 5,400+ statistical officers" },
    { name: "Events Hub", icon: Calendar, desc: "Academic calendar of national workshops & symposia" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-gray-800">
      {/* Official Government Top Header */}
      <header className="w-full bg-[#07265D] text-white text-xs py-2 px-4 sm:px-8 flex items-center justify-between border-b border-blue-900">
        <div className="flex items-center space-x-3 text-gray-200">
          <span className="font-semibold">भारत सरकार</span>
          <span className="text-gray-400">|</span>
          <span>Government of India • Ministry of Statistics and Programme Implementation</span>
        </div>
        <div className="text-[11px] text-amber-300 font-semibold hidden md:block">
          National Capacity Building Ecosystem • Mission Karmayogi
        </div>
      </header>

      {/* Main Branding Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-14 border-r border-gray-200 pr-3">
            <svg viewBox="0 0 100 120" className="w-10 h-12 text-[#0B3D91]" fill="currentColor">
              <path d="M 50,5 C 38,5 34,14 34,22 C 34,30 38,36 42,40 C 35,42 22,48 22,62 C 22,76 34,80 44,81 L 44,95 L 26,95 L 24,106 L 76,106 L 74,95 L 56,95 L 56,81 C 66,80 78,76 78,62 C 78,48 65,42 58,40 C 62,36 66,30 66,22 C 66,14 62,5 50,5 Z" fill="#0B3D91" opacity="0.9" />
              <circle cx="50" cy="100" r="4" fill="#FF9933" />
              <rect x="20" y="110" width="60" height="4" rx="2" fill="#138808" />
              <text x="50" y="119" fontSize="6.5" textAnchor="middle" fill="#07265D" fontWeight="bold">सत्यमेव जयते</text>
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 font-serif-gov">
              सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय
            </div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B3D91] font-serif-gov">
                कौशल सेतु <span className="text-amber-600 font-sans font-bold">| Skill Setu</span>
              </h1>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                MoSPI / NSSTA AI-Enabled Skill Intelligence & Learning Platform
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs bg-blue-50 text-blue-900 px-3 py-1 rounded-full border border-blue-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FRAC Taxonomy Aligned</span>
        </div>
      </div>

      {/* Tricolor Ribbon */}
      <div className="w-full flex h-[4px]">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">

          {/* Left Column: Platform Mission & 6 Hubs Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>National Statistical Capacity Building Portal</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B3D91] font-serif-gov leading-tight">
                AI-Driven Competency Intelligence for India's Statistical Cadres
              </h2>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Skill Setu links civil servants across SDRD, NAD, PSD, FOD, and DQAD to role-calibrated learning journeys,
                bridging statistical and digital gaps through the Framework for Roles, Activities, and Competencies (FRAC).
              </p>
            </div>

            {/* Hubs Architecture Grid */}
            <div className="pt-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#0B3D91] rounded-sm"></span>
                <span>The Six Functional Hubs of Skill Setu</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hubs.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div key={i} className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-xs flex items-start space-x-3 hover:border-blue-300 transition-all">
                      <div className="p-2 bg-blue-50 text-[#0B3D91] rounded-md flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{h.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{h.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* National Metrics Strip */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-around text-center">
              <div>
                <div className="text-lg font-bold text-[#0B3D91]">5,430+</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Officers Profiled</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-lg font-bold text-[#0B3D91]">30+</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">iGOT Modules</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-lg font-bold text-[#0B3D91]">8 Cohorts</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">NSSTA TPAC Track</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-lg font-bold text-[#0B3D91]">100% In-Memory</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Zero LocalStorage</div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-[#07265D] p-5 text-white border-b-2 border-amber-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Civil Service Login</span>
                  </div>
                  <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded text-gray-200 font-mono">MoSPI SSO v2.4</span>
                </div>
                <h3 className="text-xl font-bold font-serif-gov mt-1">Sign In to Your Workspace</h3>
                <p className="text-xs text-gray-300 mt-0.5">Enter your official Karmayogi ID or Government email</p>
              </div>

              <div className="p-6 space-y-4">
                {errorMsg && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 text-xs rounded flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Authentication Failed:</span> {errorMsg}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Karmayogi ID / Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder="e.g. jso.aadeesh@mospi.gov.in"
                        className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-blue-800 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                  >
                    <span>{isLoading ? "Verifying Credentials..." : "Login to Skill Setu"}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400">
                    <span className="bg-white px-2">Or Instant Single Sign-On</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loginWithParichay("learner")}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Login with Jan Parichay National SSO</span>
                </button>

                {/* Prominently Styled Evaluator Demo Credentials Box */}
                <div className="mt-5 bg-amber-50/80 border-2 border-amber-300 rounded-lg p-3.5 text-xs text-amber-950">
                  <div className="flex items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-900 mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Evaluator Quick-Access Passwords</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mb-2.5">
                    Select any role to pre-fill credentials and evaluate the exact role experience:
                  </p>

                  <div className="space-y-2">
                    {/* Learner */}
                    <div className="bg-white p-2.5 rounded border border-amber-200 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center space-x-1">
                          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-mono">LEARNER</span>
                          <span>jso.aadeesh@mospi.gov.in</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Password: <span className="font-mono font-bold text-gray-700">Learner@123</span> (Launches Onboarding)</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("jso.aadeesh@mospi.gov.in", "Learner@123")}
                        className="bg-[#0B3D91] hover:bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors flex-shrink-0 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>

                    {/* Trainer */}
                    <div className="bg-white p-2.5 rounded border border-amber-200 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center space-x-1">
                          <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-mono">TRAINER</span>
                          <span>faculty.nssta@mospi.gov.in</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Password: <span className="font-mono font-bold text-gray-700">Trainer@123</span> (Faculty Studio)</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("faculty.nssta@mospi.gov.in", "Trainer@123")}
                        className="bg-[#0B3D91] hover:bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors flex-shrink-0 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>

                    {/* Admin */}
                    <div className="bg-white p-2.5 rounded border border-amber-200 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center space-x-1">
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-mono">ADMIN</span>
                          <span>admin.mospi@mospi.gov.in</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Password: <span className="font-mono font-bold text-gray-700">Admin@123</span> (Workforce Analytics)</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("admin.mospi@mospi.gov.in", "Admin@123")}
                        className="bg-[#0B3D91] hover:bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors flex-shrink-0 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Official Gov Footer */}
      <footer className="w-full bg-[#07265D] text-gray-400 text-xs py-4 px-4 sm:px-8 border-t-2 border-blue-900 flex flex-wrap items-center justify-between gap-4">
        <div>
          National Statistical Systems Training Academy (NSSTA) • Plot 22, Knowledge Park-II, Greater Noida
        </div>
        <div>
          © 2026 Government of India • MoSPI • Smart India Hackathon PS ID: SIH26101
        </div>
      </footer>
    </div>
  );
}
