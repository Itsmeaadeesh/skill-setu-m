import React, { useState, useEffect } from "react";
import { ShieldCheck, ExternalLink, Activity, Info } from "lucide-react";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(1482942);

  // Subtle live visitor counter increment
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#07265D] text-gray-300 border-t-4 border-[#0B3D91] mt-16 text-xs select-none">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Ministry Info */}
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-sm mb-3">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span>
              <span className="font-serif-gov">Ministry of Statistics & PI</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[12px] mb-4">
              Apex statistical authority in India responsible for national accounts, price indices, sample surveys, and statistical system capacity building.
            </p>
            <div className="text-[11px] text-gray-400 space-y-1">
              <div><strong className="text-gray-300">Academy:</strong> National Statistical Systems Training Academy (NSSTA)</div>
              <div>Plot No. 22, Knowledge Park-II, Greater Noida, UP - 201310</div>
            </div>
          </div>

          {/* Col 2: Government Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-amber-400">
              National Portals
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <a href="https://mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center space-x-1">
                  <span>MoSPI Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://igotkarmayogi.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center space-x-1">
                  <span>iGOT Karmayogi Bharat</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center space-x-1">
                  <span>Open Government Data (OGD)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center space-x-1">
                  <span>Digital India Initiative</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Frameworks */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-amber-400">
              Competency Architecture
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li className="hover:text-gray-200">Karmayogi Competency Dictionary</li>
              <li className="hover:text-gray-200">FRAC (Framework for Roles, Activities & Competencies)</li>
              <li className="hover:text-gray-200">UN Fundamental Principles of Official Statistics</li>
              <li className="hover:text-gray-200">National Data Governance Framework (NDGF)</li>
              <li className="hover:text-gray-200">DPDP Act 2023 Guidelines for Statistical Surveys</li>
            </ul>
          </div>

          {/* Col 4: Platform Diagnostics & Badges */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-amber-400">
              Platform Status
            </h4>
            <div className="bg-[#0B3D91]/60 p-3 rounded border border-blue-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-300 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                  <span>AI Inference Engine</span>
                </span>
                <span className="text-green-400 font-bold">Operational</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-300">Karmayogi SSO API</span>
                <span className="text-amber-300 font-bold">Simulated (Mock)</span>
              </div>
              <div className="pt-2 border-t border-blue-800/80">
                <div className="text-[10px] text-gray-400">Total Officers Trained:</div>
                <div className="text-lg font-mono font-bold text-white tracking-widest mt-0.5">
                  {visitorCount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Smart India Hackathon Badge */}
            <div className="mt-3 flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 p-2 rounded text-[11px] text-amber-200">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Smart India Hackathon 2026 • PS ID: <strong>SIH26101</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Strip */}
      <div className="bg-[#051C42] py-4 px-4 sm:px-8 border-t border-blue-900/60 text-gray-400 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-center sm:text-left">
            © 2026 Ministry of Statistics and Programme Implementation (MoSPI), Government of India. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span className="text-gray-300 font-medium">Last Updated: 06 Sep 2026</span>
          </div>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-2">
          Note: This application runs with simulated in-memory state for demonstration. Production deployment integrates directly with live iGOT Karmayogi & NSSTA LMS APIs.
        </div>
      </div>
    </footer>
  );
}
