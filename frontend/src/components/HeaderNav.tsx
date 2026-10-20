import React, { useState } from 'react';
import { ActiveTab } from '../types/lifepath';
import { Currency, formatCurrency } from '../utils/lifepathFormatters';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currency: Currency;
  onCurrencyToggle: (currency: Currency) => void;
  isPrivate: boolean;
  onPrivacyToggle: () => void;
  netWorthINR: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  currency,
  onCurrencyToggle,
  isPrivate,
  onPrivacyToggle,
  netWorthINR,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'goals', label: 'Financial Goals', icon: 'flag' },
    { id: 'roadmap', label: 'Life Roadmap', icon: 'timeline' },
    { id: 'simulator', label: 'Future Simulator', icon: 'query_stats' },
    { id: 'advisor', label: 'AI Advisor', icon: 'auto_awesome' },
  ];

  const handleNotificationClick = () => {
    setNotificationToast('All 14 accounts synced. No overdue milestone alerts.');
    setTimeout(() => setNotificationToast(null), 3000);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto flex flex-col justify-between">
          {/* Main Top Bar */}
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onTabChange('overview')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-md shadow-primary/25">
                  <span className="material-symbols-outlined text-xl">analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold group-hover:text-primary transition-colors">
                    LifePath
                  </span>
                  <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                    AI Planner
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Tools & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Demo Badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Demo: Alex</span>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg font-label-sm text-label-sm shadow-inner">
                <button
                  type="button"
                  onClick={() => onCurrencyToggle('INR')}
                  className={`px-2 py-1 rounded transition-all font-semibold ${
                    currency === 'INR'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => onCurrencyToggle('USD')}
                  className={`px-2 py-1 rounded transition-all font-semibold ${
                    currency === 'USD'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  $ USD
                </button>
              </div>

              {/* Privacy Eye Toggle */}
              <button
                type="button"
                onClick={onPrivacyToggle}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isPrivate
                    ? 'bg-secondary-fixed text-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
                title={isPrivate ? 'Show Balances' : 'Hide Balances'}
              >
                <span className="material-symbols-outlined text-lg">
                  {isPrivate ? 'visibility_off' : 'visibility'}
                </span>
              </button>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-lg">search</span>
              </button>

              {/* Notification Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleNotificationClick}
                  aria-label="Notifications"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">notifications</span>
                </button>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/40">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface font-semibold leading-none">
                    Alex Sharma
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant leading-none mt-1">
                    Wealth Prime
                  </span>
                </div>
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-2xl">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Secondary Sub-Header Strip */}
          <div className="h-11 flex items-center justify-between gap-4 bg-surface-container-low/70 rounded-xl px-4 mb-2 border border-outline-variant/20 overflow-x-auto">
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Net Worth
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">
                  {formatCurrency(netWorthINR, currency, isPrivate, false)}
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-semibold">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+41.25% Monthly Savings Rate</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
                Macro Forecast: 2025–2055 Healthy
              </span>
              <button
                type="button"
                onClick={() => onTabChange('advisor')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-on-secondary-container transition-all shadow-[0_0_0_1px_rgba(118,87,214,0.15),0_4px_16px_-2px_rgba(118,87,214,0.3)]"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-4 py-3 shadow-xl">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left font-label-md text-label-md ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined">search</span>
                <span>Quick Search LifePath System</span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search goals, milestones, net worth nodes, simulator presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-body-md"
            />
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                Quick Shortcuts
              </span>
              <button
                type="button"
                onClick={() => {
                  onTabChange('goals');
                  setSearchOpen(false);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low text-left"
              >
                <span className="font-medium text-on-surface">🏡 Bangalore Home Down Payment</span>
                <span className="text-xs text-primary font-semibold">Goals →</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onTabChange('simulator');
                  setSearchOpen(false);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low text-left"
              >
                <span className="font-medium text-on-surface">📈 25-Year Wealth Compounding Engine</span>
                <span className="text-xs text-primary font-semibold">Simulator →</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onTabChange('advisor');
                  setSearchOpen(false);
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low text-left"
              >
                <span className="font-medium text-on-surface">🤖 LifePath Copilot Session Briefing</span>
                <span className="text-xs text-primary font-semibold">Advisor →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce font-label-md text-label-md">
          <span className="material-symbols-outlined text-tertiary-fixed text-lg">check_circle</span>
          <span>{notificationToast}</span>
        </div>
      )}
    </>
  );
};
