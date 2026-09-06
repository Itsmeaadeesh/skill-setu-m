import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  ShieldCheck,
  Contrast,
  Globe,
  LogOut,
  UserCheck
} from "lucide-react";

export default function Header() {
  const {
    role,
    currentUser,
    currentAccount,
    logout,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    language,
    setLanguage,
  } = usePlatform();

  return (
    <header className="w-full bg-white border-b border-gray-200 select-none">
      {/* Top Utility Gov Bar */}
      <div className="bg-[#07265D] text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-blue-900/60">
        <div className="flex items-center space-x-3 text-gray-200 font-medium">
          <a
            href="#main-content"
            className="hover:underline focus:bg-amber-400 focus:text-black px-1 rounded transition-colors text-[11px]"
          >
            {language === "HI" ? "मुख्य सामग्री पर जाएं" : "Skip to Main Content"}
          </a>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="hidden md:inline text-[11px]">
            {language === "HI" ? "भारत सरकार | सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय" : "Government of India | Ministry of Statistics & Programme Implementation"}
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center space-x-3">
          {/* Font Resizer */}
          <div className="flex items-center space-x-1 bg-[#0B3D91] px-2 py-0.5 rounded border border-blue-800">
            <span className="text-[10px] text-gray-300 mr-1">Font:</span>
            <button
              onClick={() => setFontSize("sm")}
              className={`px-1 text-[11px] font-bold rounded ${fontSize === "sm" ? "bg-amber-400 text-black" : "text-white hover:bg-blue-800"}`}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-1 text-[11px] font-bold rounded ${fontSize === "base" ? "bg-amber-400 text-black" : "text-white hover:bg-blue-800"}`}
              title="Default Text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-1 text-[11px] font-bold rounded ${fontSize === "lg" ? "bg-amber-400 text-black" : "text-white hover:bg-blue-800"}`}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition-colors ${
              highContrast
                ? "bg-yellow-400 text-black border-yellow-300"
                : "bg-[#0B3D91] text-gray-200 border-blue-800 hover:bg-blue-800"
            }`}
            title="Toggle High Contrast Mode"
          >
            <Contrast className="w-3 h-3" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
            className="flex items-center space-x-1 bg-[#0B3D91] hover:bg-blue-800 text-gray-200 px-2 py-0.5 rounded border border-blue-800 text-[11px] font-medium"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-amber-300" />
            <span>{language === "EN" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Current Role Badge */}
          <div className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            {role}
          </div>
        </div>
      </div>

      {/* Main Branding Bar with Indian State Emblem */}
      <div className="px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 bg-white">
        <div className="flex items-center space-x-3.5">
          {/* Ashoka Stambh Emblem SVG */}
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-16 border-r border-gray-200 pr-3">
            <svg
              viewBox="0 0 100 120"
              className="w-11 h-14 text-[#0B3D91]"
              fill="currentColor"
            >
              <path d="M 50,5 C 38,5 34,14 34,22 C 34,30 38,36 42,40 C 35,42 22,48 22,62 C 22,76 34,80 44,81 L 44,95 L 26,95 L 24,106 L 76,106 L 74,95 L 56,95 L 56,81 C 66,80 78,76 78,62 C 78,48 65,42 58,40 C 62,36 66,30 66,22 C 66,14 62,5 50,5 Z" fill="#0B3D91" opacity="0.9" />
              <circle cx="50" cy="100" r="4" fill="#FF9933" />
              <rect x="20" y="110" width="60" height="4" rx="2" fill="#138808" />
              <text x="50" y="119" fontSize="6.5" textAnchor="middle" fill="#07265D" fontWeight="bold" letterSpacing="1">
                सत्यमेव जयते
              </text>
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[13px] sm:text-sm font-semibold text-gray-700 tracking-wide font-serif-gov">
                {language === "HI" ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय" : "Ministry of Statistics & Programme Implementation"}
              </span>
              <span className="bg-blue-50 text-[#0B3D91] text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200 hidden md:inline">
                MoSPI / NSSTA
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B3D91] tracking-tight font-serif-gov">
                कौशल सेतु <span className="text-amber-600 font-sans font-bold">| Skill Setu</span>
              </h1>
              <span className="text-[11px] text-gray-500 font-medium hidden lg:inline">
                AI Skill Intelligence & Adaptive Learning Framework
              </span>
            </div>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Aligned with iGOT Karmayogi Bharat Architecture • National Statistical Systems Training Academy
            </p>
          </div>
        </div>

        {/* User Badge & Logout Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden xl:flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-center text-xs">
            <div>
              <div className="font-bold text-blue-900">5,430+</div>
              <div className="text-[9px] text-gray-500 uppercase">Officials</div>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <div className="font-bold text-blue-900">120+</div>
              <div className="text-[9px] text-gray-500 uppercase">Courses</div>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <div className="font-bold text-blue-900">28 States</div>
              <div className="text-[9px] text-gray-500 uppercase">Coverage</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-blue-50/70 p-2 rounded-lg border border-blue-200">
            <div className="w-10 h-10 rounded-full bg-[#0B3D91] text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-amber-400">
              {currentUser.avatar || "GO"}
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-900">{currentUser.name}</span>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1 py-0.2 rounded border border-green-300">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-gray-600 truncate max-w-[180px]">
                {currentUser.role}
              </div>
              <div className="text-[10px] text-blue-800 font-mono">
                {currentUser.email || currentAccount?.email || "mospi.gov.in"}
              </div>
            </div>

            <button
              onClick={logout}
              className="ml-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-colors cursor-pointer"
              title="Sign out of current session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Tiranga Ribbon under Header */}
      <div className="w-full flex h-[5px]">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#000080] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#000080] rounded-full"></div>
          </div>
        </div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
    </header>
  );
}
