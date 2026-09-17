import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './views/HomeScreen';
import { ExploreScreen } from './views/ExploreScreen';
import { ChallengeScreen } from './views/ChallengeScreen';
import { SavedScreen } from './views/SavedScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { ArticleDetailScreen } from './views/ArticleDetailScreen';
import { TopicDetailScreen } from './views/TopicDetailScreen';
import { LandingScreen } from './views/LandingScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { Bell, Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    authLoading,
    activeTab,
    selectedArticle,
    closeArticle,
    selectedTopic,
    closeTopic,
    notificationMessage
  } = useApp();

  // Show clean loading spinner while verifying local session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading NewsLens...</p>
      </div>
    );
  }

  // Requirement 5 & 8: If unauthenticated, show public landing page
  if (!currentUser) {
    return (
      <>
        <LandingScreen />
        <AuthModal />
        {notificationMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-xl border border-slate-700/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Bell className="w-3.5 h-3.5 text-indigo-400" />
            <span>{notificationMessage}</span>
          </div>
        )}
      </>
    );
  }

  const renderTabContent = () => {
    if (selectedArticle) {
      return <ArticleDetailScreen article={selectedArticle} onBack={closeArticle} />;
    }

    if (selectedTopic) {
      return <TopicDetailScreen topic={selectedTopic} onBack={closeTopic} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'challenge':
        return <ChallengeScreen />;
      case 'saved':
        return <SavedScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar navigation */}
        <DesktopSidebar />

        {/* Primary Page Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Modals & Dialogs */}
      <OnboardingModal />
      <SettingsModal />
      <AdminModal />
      <AuthModal />

      {/* Notification Toast */}
      {notificationMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-xl border border-slate-700/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Bell className="w-3.5 h-3.5 text-indigo-400" />
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
