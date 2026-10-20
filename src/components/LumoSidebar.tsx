import React from 'react';
import { ActiveTab } from '../types/lifepath';

interface LumoSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  goalsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentUser?: { name: string; email: string; membership: string };
  onOpenLogin?: () => void;
}

export const LumoSidebar: React.FC<LumoSidebarProps> = ({
  activeTab,
  onTabChange,
  goalsCount,
  mobileOpen,
  onCloseMobile,
  onOpenSettings,
  isDarkMode,
  onToggleDarkMode,
  currentUser = {
    name: 'Maya (Alex Vance)',
    email: 'maya.vance@lumofinance.ai',
    membership: 'PRO Member',
  },
  onOpenLogin,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: 'grid_view' },
    { id: 'goals' as ActiveTab, label: 'Goals Manager', icon: 'flag', badge: goalsCount },
    { id: 'roadmap' as ActiveTab, label: 'Roadmap', icon: 'timeline' },
    { id: 'simulator' as ActiveTab, label: 'Simulator', icon: 'tune' },
    { id: 'advisor' as ActiveTab, label: 'Lumo AI', icon: 'auto_awesome', pulse: true },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-space-md transition-transform duration-300 ease-in-out border-r border-outline-variant/30 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-space-md">
          {/* Brand Logo & Mark */}
          <div className="flex items-center justify-between px-space-xs py-space-xs">
            <button
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-space-sm text-left focus:outline-none group"
            >
              <img
                alt="Lumo Brand Mark"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="/lumo-logo.png"
                onError={(e) => {
                  // Fallback to hosted URL if local fails
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida/AEtjO1WXbE-S-wugxw1daMgV8vD3jTdSznBdILuFIwlgV8CkaRqQG1jq_gYbj3VBy_hFvMrgV1pg90_oRn_HYmH9Sp8B1xXpWQHXFVwe12vtBsaud1UFqvEGNDrKNikHQUy9FlEyFTlOz0X4kZYcnbkjVwd6UWzhGjBkp8vvOAH_cgIbQaHmW6IJWIuxbpZc7e4INCJrThnKM6CEubVm9HSmt_xFwCuOFePB2nXwbIEKoSGViI3LA3jArnX0tQ';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none font-bold">
                  Lumo
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  AI Financial Planner
                </span>
              </div>
            </button>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs mt-space-sm">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-space-md py-2.5 rounded-full transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-headline-sm font-bold shadow-[0_4px_14px_rgba(108,76,241,0.25)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isActive
                          ? 'text-on-primary-container'
                          : item.id === 'advisor'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-headline-sm text-sm sm:text-headline-sm">
                      {item.label}
                    </span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm ${
                        isActive
                          ? 'bg-white/20 text-on-primary-container'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.pulse && (
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="flex flex-col gap-space-xs bg-surface-container-low rounded-2xl p-space-sm border border-outline-variant/30">
          <div
            onClick={onOpenLogin}
            className="flex items-center gap-space-sm cursor-pointer p-1.5 rounded-xl hover:bg-surface-container transition-colors"
            title="Click to manage profile or switch account"
          >
            <div className="relative shrink-0">
              <img
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                src="/alex-avatar.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD6xWsUrxUL_q0-7r-QAR9p0GRLd_ATKKzSPyGf5J_zbURoSHb5d52QfFMSpdqdwSuiF7Yp6laP3x6A4PThC8gfY9GzveJMqPsK0V-Z11lLZDEhHeObasmFeJ-WrHb9Y2ZtGoDhjQkMLspuq00byHgW2fOTuEeUUXANEyukWnwTbT_mLZXNgWF19QLqSUgZjH5To-f9QTZY-I1MTqEljPayP1RuoazFkvn-B9o-dzFWt_Q01wUJ-XW3';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-headline-sm text-sm text-on-surface truncate font-semibold">
                {currentUser.name}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                {currentUser.membership}
              </span>
            </div>
            <span className="material-symbols-outlined text-base text-primary">login</span>
          </div>

          {/* Quick Controls: Dark Mode & Settings */}
          {onToggleDarkMode && (
            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 px-1">
              <button
                onClick={onToggleDarkMode}
                className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface py-1 px-2 rounded-lg hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span className="text-[11px] font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="flex items-center justify-center text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
                title="Account Settings"
              >
                <span className="material-symbols-outlined text-base">settings</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
