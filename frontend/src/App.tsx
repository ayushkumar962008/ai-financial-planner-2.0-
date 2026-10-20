import React, { useState, useEffect } from 'react';
import { ActiveTab, FinancialGoal } from './types/lifepath';
import { Currency } from './utils/lifepathFormatters';
import { INITIAL_GOALS } from './data/lifepathData';
import { fetchGoals, createGoal } from './services/api';
import { LumoSidebar } from './components/LumoSidebar';
import { LumoHeader } from './components/LumoHeader';
import { OverviewView } from './components/OverviewView';
import { GoalsPlannerView } from './components/GoalsPlannerView';
import { LifeRoadmapView } from './components/LifeRoadmapView';
import { FutureWealthSimulatorView } from './components/FutureWealthSimulatorView';
import { AIFinancialAdvisorView } from './components/AIFinancialAdvisorView';
import { AddGoalModal } from './components/AddGoalModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User Authentication & Profile State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; membership: string }>(() => {
    const saved = localStorage.getItem('lumo_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: 'Maya (Alex Vance)',
      email: 'maya.vance@lumofinance.ai',
      membership: 'PRO Member',
    };
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('lumo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lumo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lumo_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleLoginSuccess = (user: { name: string; email: string; membership: string }) => {
    setCurrentUser(user);
    localStorage.setItem('lumo_user', JSON.stringify(user));
  };

  // Global Settings State
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('lumo_currency') as Currency) || 'USD';
  });

  const [isPrivate, setIsPrivate] = useState<boolean>(() => {
    return localStorage.getItem('lumo_private') === 'true';
  });

  // Financial Goals State
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('lumo_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_GOALS;
      }
    }
    return INITIAL_GOALS;
  });

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('lumo_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('lumo_private', isPrivate.toString());
  }, [isPrivate]);

  useEffect(() => {
    localStorage.setItem('lumo_goals', JSON.stringify(goals));
  }, [goals]);

  // Load goals from backend database
  useEffect(() => {
    fetchGoals()
      .then((serverGoals) => {
        if (serverGoals && serverGoals.length > 0) {
          setGoals(serverGoals);
        }
      })
      .catch((err) => {
        console.warn('Backend goals sync offline, using local data:', err);
      });
  }, []);

  const handleNavigateTab = (tab: ActiveTab, contextPrompt?: string) => {
    if (contextPrompt) {
      setAdvisorInitialPrompt(contextPrompt);
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGoal = async (newGoal: FinancialGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
    try {
      await createGoal(newGoal);
    } catch (err) {
      console.warn('Could not persist goal to database:', err);
    }
  };

  const handleSearchSubmit = (query: string) => {
    handleNavigateTab('advisor', query);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-200">
      {/* Lumo Desktop Sidebar & Mobile Drawer */}
      <LumoSidebar
        activeTab={activeTab}
        onTabChange={handleNavigateTab}
        goalsCount={goals.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSettings={() => handleNavigateTab('advisor', 'How do I configure my Lumo account and telemetry?')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
      />

      {/* Lumo Fixed Top Header */}
      <LumoHeader
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenAddGoal={() => setIsAddGoalOpen(true)}
        currency={currency}
        onCurrencyToggle={(c) => setCurrency(c)}
        isPrivate={isPrivate}
        onPrivacyToggle={() => setIsPrivate(!isPrivate)}
        healthScore={94}
        onSearchSubmit={handleSearchSubmit}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area — Offset for Left Sidebar & Top Header */}
      <div className="lg:pl-72 flex flex-col justify-between min-h-screen">
        <main className="relative pt-20 px-4 sm:px-6 lg:px-space-lg w-full flex-1">
          {activeTab === 'dashboard' && (
            <OverviewView
              currency={currency}
              isPrivate={isPrivate}
              onNavigateTab={handleNavigateTab}
              goals={goals}
              onOpenAddGoal={() => setIsAddGoalOpen(true)}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsPlannerView
              goals={goals}
              onAddGoal={handleAddGoal}
              currency={currency}
              isPrivate={isPrivate}
              onOpenAddGoal={() => setIsAddGoalOpen(true)}
            />
          )}

          {activeTab === 'roadmap' && (
            <LifeRoadmapView
              currency={currency}
              isPrivate={isPrivate}
            />
          )}

          {activeTab === 'simulator' && (
            <FutureWealthSimulatorView
              currency={currency}
              isPrivate={isPrivate}
            />
          )}

          {activeTab === 'advisor' && (
            <AIFinancialAdvisorView
              initialPrompt={advisorInitialPrompt}
              currency={currency}
              isPrivate={isPrivate}
              onNavigateTab={handleNavigateTab}
            />
          )}
        </main>

        {/* Footer */}
        <Footer onNavigateTab={handleNavigateTab} />
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={handleAddGoal}
        currency={currency}
      />

      {/* User Login & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 flex items-center justify-around px-2 z-40 shadow-lg">
        <button
          onClick={() => handleNavigateTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1 text-xs font-semibold ${
            activeTab === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-xl">grid_view</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleNavigateTab('goals')}
          className={`flex flex-col items-center justify-center p-1 text-xs font-semibold ${
            activeTab === 'goals' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-xl">flag</span>
          <span>Goals</span>
        </button>

        <button
          onClick={() => handleNavigateTab('roadmap')}
          className={`flex flex-col items-center justify-center p-1 text-xs font-semibold ${
            activeTab === 'roadmap' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-xl">timeline</span>
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => handleNavigateTab('simulator')}
          className={`flex flex-col items-center justify-center p-1 text-xs font-semibold ${
            activeTab === 'simulator' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-xl">tune</span>
          <span>Simulator</span>
        </button>

        <button
          onClick={() => handleNavigateTab('advisor')}
          className={`flex flex-col items-center justify-center p-1 text-xs font-semibold ${
            activeTab === 'advisor' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <span>AI</span>
        </button>
      </div>
    </div>
  );
}

export default App;
