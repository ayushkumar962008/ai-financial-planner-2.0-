import React, { useState } from 'react';
import { Currency } from '../utils/lifepathFormatters';

interface LumoHeaderProps {
  onToggleMobileMenu: () => void;
  onOpenAddGoal: () => void;
  currency: Currency;
  onCurrencyToggle: (currency: Currency) => void;
  isPrivate: boolean;
  onPrivacyToggle: () => void;
  healthScore?: number;
  onSearchSubmit?: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser?: { name: string; email: string; membership: string };
  onOpenLogin: () => void;
}

export const LumoHeader: React.FC<LumoHeaderProps> = ({
  onToggleMobileMenu,
  onOpenAddGoal,
  currency,
  onCurrencyToggle,
  isPrivate,
  onPrivacyToggle,
  healthScore = 94,
  onSearchSubmit,
  isDarkMode,
  onToggleDarkMode,
  currentUser = {
    name: 'Maya (Alex Vance)',
    email: 'maya.vance@lumofinance.ai',
    membership: 'PRO Member',
  },
  onOpenLogin,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Surplus Auto-Sweep Active',
      desc: '$450 scheduled for Vanguard S&P 500 DCA tomorrow.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Emergency Cushion Milestone',
      desc: 'You are now 3 months ahead of your safety reserve target ($23,000)!',
      time: '2h ago',
      unread: true,
    },
    {
      id: '3',
      title: '2031 Home Gap Alert',
      desc: 'Estimated -$24,500 down payment shortfall detected under baseline trajectory.',
      time: '1d ago',
      unread: false,
    },
  ];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchVal.trim());
      }
    }
  };

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR'];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 lg:px-space-lg border-b border-outline-variant/30 transition-all">
      {/* Left: Mobile Hamburger & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-full hover:bg-surface-container text-on-surface-variant focus:outline-none"
          aria-label="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-space-xs w-full bg-surface-container-lowest rounded-full px-space-md py-1.5 shadow-[0_1px_8px_rgba(0,0,0,0.02)] border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            placeholder="Ask Lumo or search goals, assets, metrics..."
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal('')}
              className="text-on-surface-variant hover:text-on-surface text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Health Score Pill */}
        <div className="hidden sm:flex items-center gap-space-sm bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
            Health Score
          </span>
          <span className="font-headline-sm text-sm text-secondary font-bold">
            {healthScore}/100
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container px-2.5 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface border border-outline-variant/20 transition-colors"
            title="Switch Currency"
          >
            <span className="font-bold">{currency}</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>

          {showCurrencyMenu && (
            <div className="absolute right-0 top-full mt-2 w-28 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-1.5 z-50 flex flex-col gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onCurrencyToggle(c);
                    setShowCurrencyMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between ${
                    currency === c
                      ? 'bg-primary-container text-on-primary-container'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>{c}</span>
                  {currency === c && (
                    <span className="material-symbols-outlined text-xs">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Switcher */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full transition-colors border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined text-lg">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Privacy Toggle */}
        <button
          onClick={onPrivacyToggle}
          className={`p-2 rounded-full transition-colors border border-outline-variant/20 ${
            isPrivate
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
          title={isPrivate ? 'Privacy Mode ON (amounts hidden)' : 'Privacy Mode OFF'}
        >
          <span className="material-symbols-outlined text-lg">
            {isPrivate ? 'visibility_off' : 'visibility'}
          </span>
        </button>

        {/* New Goal Action Button */}
        <button
          onClick={onOpenAddGoal}
          className="flex items-center gap-1.5 bg-primary text-on-primary px-3 sm:px-space-md py-2 rounded-full font-headline-sm text-sm shadow-[0_4px_14px_rgba(108,76,241,0.35)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="hidden sm:inline">New Goal</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-space-md z-50 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="font-headline-sm text-sm font-bold text-on-surface">
                  Notifications
                </span>
                <span className="font-label-sm text-label-sm text-primary font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-xs font-semibold text-on-surface">
                        {n.title}
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant">
                        {n.time}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-primary/40 focus:outline-none transition-all"
            title="View User Profile & Login"
            aria-label="User Profile"
          >
            <div className="relative">
              <img
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                src="/alex-avatar.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD6xWsUrxUL_q0-7r-QAR9p0GRLd_ATKKzSPyGf5J_zbURoSHb5d52QfFMSpdqdwSuiF7Yp6laP3x6A4PThC8gfY9GzveJMqPsK0V-Z11lLZDEhHeObasmFeJ-WrHb9Y2ZtGoDhjQkMLspuq00byHgW2fOTuEeUUXANEyukWnwTbT_mLZXNgWF19QLqSUgZjH5To-f9QTZY-I1MTqEljPayP1RuoazFkvn-B9o-dzFWt_Q01wUJ-XW3';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant hidden sm:inline">
              expand_more
            </span>
          </button>

          {/* Profile Dropdown Card */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 p-5 z-50 animate-in fade-in zoom-in-95 flex flex-col gap-4">
              {/* User Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20">
                <div className="relative">
                  <img
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40 shadow-sm"
                    src="/alex-avatar.png"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuD6xWsUrxUL_q0-7r-QAR9p0GRLd_ATKKzSPyGf5J_zbURoSHb5d52QfFMSpdqdwSuiF7Yp6laP3x6A4PThC8gfY9GzveJMqPsK0V-Z11lLZDEhHeObasmFeJ-WrHb9Y2ZtGoDhjQkMLspuq00byHgW2fOTuEeUUXANEyukWnwTbT_mLZXNgWF19QLqSUgZjH5To-f9QTZY-I1MTqEljPayP1RuoazFkvn-B9o-dzFWt_Q01wUJ-XW3';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-headline-sm text-sm font-bold text-on-surface truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-on-surface-variant truncate">
                    {currentUser.email}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold w-fit mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {currentUser.membership}
                  </span>
                </div>
              </div>

              {/* Financial Telemetry Snippet */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Net Worth</span>
                  <span className="font-bold text-on-surface text-sm">$143,300</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Savings Rate</span>
                  <span className="font-bold text-secondary text-sm">43.3% /mo</span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenLogin();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-headline-sm text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Log In / Switch Account</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onToggleDarkMode();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>Dark Theme</span>
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {isDarkMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onPrivacyToggle();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      {isPrivate ? 'visibility_off' : 'visibility'}
                    </span>
                    <span>Privacy Shield</span>
                  </span>
                  <span className="text-[10px] font-bold text-secondary uppercase">
                    {isPrivate ? 'Active' : 'Off'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
