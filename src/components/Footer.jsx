import React, { useState, useEffect } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { ShieldCheck, ExternalLink, Activity, Info, FileSpreadsheet, Award } from "lucide-react";

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
      {/* Partner Strip: Mission Karmayogi & Karmayogi Bharat */}
      <div className="bg-[#051c44] border-b border-blue-900 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              National Capacity Building Ecosystem:
            </span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="text-gray-300">Karmayogi Bharat (Special Purpose Vehicle)</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-300">FRAC Framework Aligned</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-300">NSSTA Greater Noida</span>
          </div>

          <div className="text-[11px] bg-blue-950 text-amber-300 border border-blue-800 px-3 py-1 rounded font-bold flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Official MoSPI Civil Service Portal</span>
          </div>
        </div>
      </div>

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
                <span className="text-amber-300 font-bold">Jan Parichay Active</span>
              </div>
              <div className="pt-2 border-t border-blue-800/80">
                <div className="text-[10px] text-gray-400">Total Officers Trained:</div>
                <div className="text-base font-bold text-white font-mono">
                  5,430+ Across 28 States
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Audit & Counter Bar */}
      <div className="bg-[#041635] py-4 px-4 sm:px-8 border-t border-blue-950 text-gray-400 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Smart India Hackathon 2026 • PS ID: SIH26101</span>
            </div>
            <span>|</span>
            <span>Skill Setu Platform • Release v2.4 (iGOT Aligned)</span>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              Last Updated: <span className="text-gray-300 font-medium">06 September 2026</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded border border-blue-900 font-mono">
              <span className="text-gray-400 text-[10px]">VISITORS:</span>
              <span className="text-amber-400 font-bold tracking-widest">{visitorCount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
