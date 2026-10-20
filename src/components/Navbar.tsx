import React from 'react';
import { 
  TrendingUp, 
  PieChart, 
  LineChart, 
  DollarSign, 
  ShieldAlert, 
  Bot, 
  Plus, 
  Settings, 
  Sparkles, 
  Activity,
  Key
} from 'lucide-react';
import { Currency } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { getGeminiApiKey } from '../services/geminiService';

export type ActiveTab = 'overview' | 'watchlist' | 'dividends' | 'risk' | 'copilot';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  currency: Currency;
  onOpenAddAsset: () => void;
  onOpenSettings: () => void;
  onOpenAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalValue,
  totalChange24h,
  totalChangePercent24h,
  currency,
  onOpenAddAsset,
  onOpenSettings,
  onOpenAudit,
}) => {
  const hasApiKey = Boolean(getGeminiApiKey());
  const isPositive = totalChange24h >= 0;

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  ApexWealth <span className="text-cyan-400">AI</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Portfolio & Market Risk Engine
              </p>
            </div>
          </div>

          {/* Real-time Portfolio Snapshot Badge */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-900/60 border border-white/[0.08] px-4 py-2 rounded-2xl">
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Portfolio Net Worth
              </div>
              <div className="text-base font-bold font-mono text-white">
                {formatCurrency(totalValue, currency)}
              </div>
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold font-mono ${
              isPositive 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              <span>{formatPercent(totalChangePercent24h)}</span>
              <span className="text-[10px] opacity-75">({formatCurrency(totalChange24h, currency)})</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Status Pill */}
            <button
              onClick={onOpenSettings}
              title={hasApiKey ? "Gemini 3.8 Flash Connected" : "Running in Demo AI Mode. Click to add API Key."}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                hasApiKey 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {hasApiKey ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Gemini Live</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Connect Key</span>
                </>
              )}
            </button>

            {/* Run AI Health Audit */}
            <button
              onClick={onOpenAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI Audit</span>
            </button>

            {/* Add Asset Button */}
            <button
              onClick={onOpenAddAsset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Asset</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-white/[0.08] transition-all"
              title="Settings & API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-white/[0.04] pt-2 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>Portfolio Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'watchlist'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <LineChart className="w-4 h-4 text-emerald-400" />
            <span>Market Watchlist</span>
          </button>

          <button
            onClick={() => setActiveTab('dividends')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'dividends'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Dividend Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'risk'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>AI Risk & Stress Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'copilot'
                ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>FinAI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          </button>
        </nav>
      </div>
    </header>
  );
};
