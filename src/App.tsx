import React from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext.js";
import Sidebar from "./components/Sidebar.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import ToastContainer from "./components/ToastContainer.js";
import QuizTakingModal from "./pages/QuizTakingModal.js";

// Pages
import LoginPage from "./pages/LoginPage.js";
import LearnerOnboardingPage from "./pages/LearnerOnboardingPage.js";
import LearnerDashboard from "./pages/LearnerDashboard.js";
import AssessmentEnginePage from "./pages/AssessmentEnginePage.js";
import CourseCataloguePage from "./pages/CourseCataloguePage.js";
import AIQuizStudioPage from "./pages/AIQuizStudioPage.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import ProfilePage from "./pages/ProfilePage.js";

const AppContent: React.FC = () => {
  const { isAuthenticated, authLoading, currentUser, role, activeTab } = usePlatform();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 gap-3">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Initializing Skill Setu Platform...
        </p>
      </div>
    );
  }

  // 1. Unauthenticated -> Login / Register Screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // 2. First-Time Learner Onboarding (Track Selection)
  if (role === "learner" && currentUser && !currentUser.hasOnboarded) {
    return (
      <>
        <LearnerOnboardingPage />
        <ToastContainer />
      </>
    );
  }

  // 3. Tab Router
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return role === "admin" ? <AdminDashboard /> : <LearnerDashboard />;
      case "assessments":
        return <AssessmentEnginePage />;
      case "path":
        return <LearnerDashboard />;
      case "courses":
        return <CourseCataloguePage />;
      case "ai-studio":
        return <AIQuizStudioPage />;
      case "history":
        return <LearnerDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "profile":
        return <ProfilePage />;
      default:
        return role === "admin" ? <AdminDashboard /> : <LearnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>

        <Footer />
      </div>

      {/* Global Modals & Notifications */}
      <QuizTakingModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
};

export default App;
