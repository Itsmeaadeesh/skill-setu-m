import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import { MOCK_ORG_ANALYTICS, MOCK_PROFILES } from "../data/mockData.js";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const { switchUser } = usePlatform();
  const [selectedDept, setSelectedDept] = useState("ALL");

  const deptData = MOCK_ORG_ANALYTICS.departmentGaps;
  const cadreData = MOCK_ORG_ANALYTICS.cadreDistribution;
  const trendData = MOCK_ORG_ANALYTICS.emergingDemandTrends;
  const coverageData = MOCK_ORG_ANALYTICS.overallCompetencyCoverage;

  const COLORS = ["#0B3D91", "#1E40AF", "#3B82F6", "#FF9933", "#EF4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Ministry Leadership & Cadre Management</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI Organizational Skill Intelligence Dashboard
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ministry-wide macro analytics on statistical capacity, department gap heatmaps, and emerging skill demand.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-green-100 text-green-800 font-bold px-3 py-1.5 rounded-lg border border-green-300">
            Cadre Strength: 5,430 Officers
          </span>
        </div>
      </div>

      {/* Top High-level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            Total Survey Cadre
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">5,430</div>
          <div className="text-[11px] text-green-700 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+8.4% capacity vs 2025</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            Average Ministry Competency
          </div>
          <div className="text-2xl font-bold text-[#0B3D91] mt-1">3.2 / 5.0</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">
            Baseline: Intermediate Level
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            Annual Training Compliance
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">76.8%</div>
          <div className="text-[11px] text-gray-600 mt-1">
            Target: 85% by Q4 2026
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            Critical Skill Gap Index
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">18.4%</div>
          <div className="text-[11px] text-red-700 font-medium mt-1">
            Concentrated in Python & DPDP
          </div>
        </div>
      </div>

      {/* Row 2: Charts - Competency Distribution (Donut) & Emerging Skill Demands (Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Ministry Competency Distribution */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                Ministry-Wide Competency Coverage
              </h3>
              <p className="text-[11px] text-gray-500">Breakdown of officers by verified proficiency level</p>
            </div>
            <PieIcon className="w-4 h-4 text-gray-400" />
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Emerging Skill Demands */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0B3D91] font-serif-gov">
                Emerging Skill Demand Trajectory (2024 - 2027)
              </h3>
              <p className="text-[11px] text-gray-500">
                MoSPI projected capacity requirements (% of workforce needing proficiency)
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="pythonAndAI" name="Python & AI/ML" stroke="#0B3D91" strokeWidth={2.5} />
                <Line type="monotone" dataKey="dpdpPrivacy" name="DPDP Act Privacy" stroke="#FF9933" strokeWidth={2.5} />
                <Line type="monotone" dataKey="cloudAPIs" name="Cloud & Open APIs" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Department Skill Gap Heatmap Table */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov">
              Department-Wise Competency Heatmap & Compliance
            </h3>
            <p className="text-xs text-gray-500">
              Proficiency indices across MoSPI divisions (Scale: 0 - 100 benchmark score)
            </p>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            FOD • SDRD • NAD • ESD • DQAD • NSSTA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-200">
            <thead className="bg-[#07265D] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3 border-b border-gray-300">Department / Division</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Staff Count</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Statistical Methods</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Technical & Python</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Digital Governance</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Behavioural & Leadership</th>
                <th className="py-2.5 px-3 border-b border-gray-300 text-center">Intervention Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deptData.map((d, idx) => {
                const getHeatBg = (score) => {
                  if (score >= 85) return "bg-green-100 text-green-900 font-bold";
                  if (score >= 65) return "bg-blue-50 text-blue-900 font-semibold";
                  return "bg-red-100 text-red-900 font-bold";
                };

                const minScore = Math.min(d.statistical, d.technical, d.digitalGov, d.behavioural);

                return (
                  <tr key={idx} className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-3 font-bold text-gray-900">{d.department}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600 font-mono">{d.totalStaff}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getHeatBg(d.statistical)}`}>
                        {d.statistical}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getHeatBg(d.technical)}`}>
                        {d.technical}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getHeatBg(d.digitalGov)}`}>
                        {d.digitalGov}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${getHeatBg(d.behavioural)}`}>
                        {d.behavioural}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {minScore < 50 ? (
                        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                          Urgent Technical Upskilling
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded">
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Cadre-Wise Performance Summary */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h3 className="text-base font-bold text-[#0B3D91] font-serif-gov mb-3">
          Cadre Breakdown & iGOT Karmayogi Adoption
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cadreData.map((c, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
              <div className="text-xs font-bold text-gray-900">{c.cadre}</div>
              <div className="text-xl font-bold text-[#0B3D91] mt-1">{c.count} Officers</div>
              <div className="mt-2 text-[11px] text-gray-600 flex justify-between">
                <span>Avg Proficiency:</span>
                <span className="font-bold text-gray-900">{c.avgProficiency} / 5</span>
              </div>
              <div className="mt-1 text-[11px] text-gray-600 flex justify-between">
                <span>Training Completion:</span>
                <span className="font-bold text-green-700">{c.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-600 h-full rounded-full" style={{ width: `${c.completionRate}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
