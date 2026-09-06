import React from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext.jsx";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import ScoreUpdateModal from "./components/ScoreUpdateModal.jsx";
import ParichayLoginModal from "./components/ParichayLoginModal.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Pages
import LearnHubPage from "./pages/LearnHubPage.jsx";
import CompetencyProfilePage from "./pages/CompetencyProfilePage.jsx";
import CareerHubPage from "./pages/CareerHubPage.jsx";
import DiscussHubPage from "./pages/DiscussHubPage.jsx";
import NetworkHubPage from "./pages/NetworkHubPage.jsx";
import EventsHubPage from "./pages/EventsHubPage.jsx";
import TrainerStudioPage from "./pages/TrainerStudioPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import WorkforcePlanningPage from "./pages/WorkforcePlanningPage.jsx";
import UserRoleManagementPage from "./pages/UserRoleManagementPage.jsx";
import AuditLogPage from "./pages/AuditLogPage.jsx";
import PSComplianceMatrixPage from "./pages/PSComplianceMatrixPage.jsx";
import QuizTakingModal from "./pages/QuizTakingModal.jsx";

function AppContent() {
  const { activeHub, role, psMatrixModalOpen, setPsMatrixModalOpen } = usePlatform();

  const renderActiveHub = () => {
    // 1. Trainer Specialized Views
    if (role === "trainer") {
      switch (activeHub) {
        case "trainer-studio":
          return <TrainerStudioPage />;
        case "learn":
          return <LearnHubPage />;
        case "discuss":
          return <DiscussHubPage />;
        case "network":
          return <NetworkHubPage />;
        default:
          return <TrainerStudioPage />;
      }
    }

    // 2. Admin Specialized Views
    if (role === "admin") {
      switch (activeHub) {
        case "admin-analytics":
          return <AdminDashboard />;
        case "admin-workforce":
          return <WorkforcePlanningPage />;
        case "admin-roles":
          return <UserRoleManagementPage />;
        case "admin-audit":
          return <AuditLogPage />;
        case "learn":
          return <LearnHubPage />;
        default:
          return <AdminDashboard />;
      }
    }

    // 3. Learner Experience: The authentic iGOT Karmayogi SIX FUNCTIONAL HUBS
    switch (activeHub) {
      case "learn":
        return <LearnHubPage />;
      case "competency":
        return <CompetencyProfilePage />;
      case "career":
        return <CareerHubPage />;
      case "discuss":
        return <DiscussHubPage />;
      case "network":
        return <NetworkHubPage />;
      case "events":
        return <EventsHubPage />;
      default:
        return <LearnHubPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-gray-800">
      {/* Official Government Portal Header */}
      <Header />

      {/* Navigation Navbar (6 Hubs / Role Specific) */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {renderActiveHub()}
      </main>

      {/* Official Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <QuizTakingModal />
      <ScoreUpdateModal />
      <ParichayLoginModal />
      {psMatrixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0B3D91] max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPsMatrixModalOpen(false)}
                className="text-xs font-bold bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-gray-800"
              >
                ✕ Close Matrix
              </button>
            </div>
            <PSComplianceMatrixPage />
          </div>
        </div>
      )}
      <ToastContainer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <AppContent />
      </PlatformProvider>
    </ErrorBoundary>
  );
}
