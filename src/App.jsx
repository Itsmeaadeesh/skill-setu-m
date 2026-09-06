import React from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext.jsx";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import ScoreUpdateModal from "./components/ScoreUpdateModal.jsx";

// Pages
import LearnerDashboard from "./pages/LearnerDashboard.jsx";
import CompetencyProfilePage from "./pages/CompetencyProfilePage.jsx";
import SkillGapEnginePage from "./pages/SkillGapEnginePage.jsx";
import RecommendationsPage from "./pages/RecommendationsPage.jsx";
import CourseCataloguePage from "./pages/CourseCataloguePage.jsx";
import AssessmentEnginePage from "./pages/AssessmentEnginePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import QuizTakingModal from "./pages/QuizTakingModal.jsx";

function AppContent() {
  const { activeTab } = usePlatform();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <LearnerDashboard />;
      case "profile":
        return <CompetencyProfilePage />;
      case "skillgap":
        return <SkillGapEnginePage />;
      case "recommendations":
        return <RecommendationsPage />;
      case "catalogue":
        return <CourseCataloguePage />;
      case "assessments":
        return <AssessmentEnginePage />;
      case "admin":
        return <AdminDashboard />;
      case "reports":
        return <ReportsPage />;
      case "help":
        return <HelpPage />;
      default:
        return <LearnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-gray-800">
      {/* Official Government Portal Header */}
      <Header />

      {/* Navigation Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {renderActiveTab()}
      </main>

      {/* Official Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <QuizTakingModal />
      <ScoreUpdateModal />
      <ToastContainer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
