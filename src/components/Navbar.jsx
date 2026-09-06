import React from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  LayoutDashboard,
  UserCheck,
  GitCompare,
  Sparkles,
  BookOpen,
  FileCheck2,
  BarChart3,
  FileSpreadsheet,
  HelpCircle,
} from "lucide-react";

export default function Navbar() {
  const { activeTab, setActiveTab, role, language } = usePlatform();

  const navItems = [
    {
      id: "dashboard",
      label: language === "HI" ? "डैशबोर्ड" : "Dashboard",
      icon: LayoutDashboard,
      roles: ["learner", "trainer", "admin"],
    },
    {
      id: "profile",
      label: language === "HI" ? "दक्षता प्रोफ़ाइल" : "Competency Profile",
      icon: UserCheck,
      roles: ["learner", "trainer", "admin"],
    },
    {
      id: "skillgap",
      label: language === "HI" ? "कौशल अंतर विश्लेषण" : "Skill-Gap Engine",
      icon: GitCompare,
      roles: ["learner", "admin"],
    },
    {
      id: "recommendations",
      label: language === "HI" ? "एआई अनुशंसाएं" : "AI Recommendations",
      icon: Sparkles,
      roles: ["learner", "admin"],
      badge: "AI",
    },
    {
      id: "catalogue",
      label: language === "HI" ? "iGOT पाठ्यक्रम" : "iGOT Courses",
      icon: BookOpen,
      roles: ["learner", "trainer", "admin"],
    },
    {
      id: "assessments",
      label:
        role === "trainer"
          ? language === "HI"
            ? "एआई प्रश्न जनरेटर स्टूडियो"
            : "AI Assessment Studio"
          : language === "HI"
          ? "मूल्यांकन एवं क्विज़"
          : "Assessments & Quiz",
      icon: FileCheck2,
      roles: ["learner", "trainer", "admin"],
      badge: role === "trainer" ? "Trainer" : undefined,
    },
    {
      id: "admin",
      label: language === "HI" ? "संगठन विश्लेषण" : "Org Analytics",
      icon: BarChart3,
      roles: ["admin", "trainer", "learner"],
      badge: role === "admin" ? "Admin" : undefined,
    },
    {
      id: "reports",
      label: language === "HI" ? "रिपोर्ट एवं ऑडिट" : "Reports",
      icon: FileSpreadsheet,
      roles: ["learner", "trainer", "admin"],
    },
    {
      id: "help",
      label: language === "HI" ? "सहायता / SIH दिशानिर्देश" : "Help & SIH Info",
      icon: HelpCircle,
      roles: ["learner", "trainer", "admin"],
    },
  ];

  return (
    <nav className="bg-[#0B3D91] shadow-md border-b-2 border-amber-500 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? "bg-[#07265D] text-amber-300 font-bold shadow-inner border-b-2 border-amber-400"
                    : "text-gray-100 hover:bg-blue-900 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-blue-300"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
                      item.badge === "AI"
                        ? "bg-amber-400 text-blue-950"
                        : "bg-blue-800 text-blue-100 border border-blue-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
