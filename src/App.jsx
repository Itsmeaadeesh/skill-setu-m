import React from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext.jsx";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import ScoreUpdateModal from "./components/ScoreUpdateModal.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AdminOfficialDrilldownModal from "./components/AdminOfficialDrilldownModal.jsx";

// Auth & Onboarding Pages
import LoginPage from "./pages/LoginPage.jsx";
import LearnerOnboardingPage from "./pages/LearnerOnboardingPage.jsx";
import TrainerOnboardingPage from "./pages/TrainerOnboardingPage.jsx";

// Portal Hubs & Pages
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
import QuizTakingModal from "./pages/QuizTakingModal.jsx";

function AppContent() {
  const { isAuthenticated, currentAccount, role, activeHub } = usePlatform();

  // 1. Unauthenticated Gateway: Full-screen authentic GoI login portal
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // 2. First-Time Learner Onboarding Wizard
  if (role === "learner" && currentAccount && !currentAccount.hasOnboarded) {
    return (
      <>
        <LearnerOnboardingPage />
        <ToastContainer />
      </>
    );
  }

  // 3. First-Time Trainer Onboarding
  if (role === "trainer" && currentAccount && !currentAccount.hasOnboarded) {
    return (
      <>
        <TrainerOnboardingPage />
        <ToastContainer />
      </>
    );
  }

  // 4. Authenticated Hub Router
  const renderActiveHub = () => {
    // Trainer Specialized Views
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

    // Admin Leadership Views
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

    // Learner Experience: The authentic iGOT Karmayogi SIX FUNCTIONAL HUBS
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

      {/* Navigation Navbar (Role Specific & 6 Hubs) */}
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
      <AdminOfficialDrilldownModal />
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
