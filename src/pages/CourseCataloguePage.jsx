import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext.jsx";
import {
  IGOT_COURSES,
  COMPETENCY_CATEGORIES,
  COMPETENCIES,
} from "../data/mockData.js";
import {
  Search,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  ExternalLink,
  Layers,
  Filter,
} from "lucide-react";

export default function CourseCataloguePage() {
  const { enrolledCourses, enrollInCourse } = usePlatform();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const filteredCourses = IGOT_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "ALL" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>iGOT Karmayogi Bharat Integration</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D91] font-serif-gov mt-0.5">
            MoSPI & NSSTA Course Catalogue
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Official accredited modules spanning Statistical Methods, Data Science, Governance & Civil Service Leadership.
          </p>
        </div>

        <div className="text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-medium">
          Showing <strong>{filteredCourses.length}</strong> of {IGOT_COURSES.length} Modules
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, code, or institute..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Category & Level Dropdowns */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All Competency Categories</option>
            {Object.values(COMPETENCY_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-2 font-medium bg-white text-gray-700 focus:outline-none"
          >
            <option value="ALL">All Proficiency Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isEnrolled = !!enrolledCourses[course.id];
          const isCompleted = enrolledCourses[course.id]?.status === "completed";
          const progress = enrolledCourses[course.id]?.progress || 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-[#0B3D91] transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl">{course.thumbnail}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                      {course.code}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold mt-0.5">
                      {course.level}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <div className="text-[11px] text-blue-900 font-semibold mt-1">
                  {course.provider}
                </div>

                <p className="text-[11px] text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Metadata Pills */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{course.durationHours} Hours</span>
                  </span>
                  <span className="text-amber-600 font-bold">
                    ★ {course.rating} ({course.enrolledCount})
                  </span>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                {isCompleted ? (
                  <div className="w-full bg-green-100 text-green-800 text-xs font-bold py-1.5 rounded text-center border border-green-300 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Completed (100%)</span>
                  </div>
                ) : isEnrolled ? (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 font-semibold mb-1">
                      <span>Enrolled</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => enrollInCourse(course.id)}
                    className="w-full bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Enroll on iGOT</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
