import React, { useState, useEffect } from 'react';
import { ActiveTab, FinancialGoal, AutoTransferItem } from '../types/lifepath';
import { Currency, formatCurrency } from '../utils/lifepathFormatters';
import { INITIAL_TRANSFERS, INITIAL_SPENDING_CATEGORIES } from '../data/lifepathData';
import { fetchPortfolio, fetchTransfers, executeNextMove } from '../services/api';

interface OverviewViewProps {
  currency: Currency;
  isPrivate: boolean;
  onNavigateTab: (tab: ActiveTab, prompt?: string) => void;
  goals: FinancialGoal[];
  onOpenAddGoal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currency,
  isPrivate,
  onNavigateTab,
  goals,
  onOpenAddGoal,
}) => {
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | 'ALL'>('1Y');
  const [moveExecuted, setMoveExecuted] = useState(false);
  const [idleChecking, setIdleChecking] = useState(3140);
  const [netWorth, setNetWorth] = useState(142850);
  const [transfers, setTransfers] = useState<AutoTransferItem[]>(INITIAL_TRANSFERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with persistent backend database
  useEffect(() => {
    fetchPortfolio()
      .then((p) => {
        if (p) {
          setIdleChecking(p.idleChecking);
          setNetWorth(p.netWorth);
        }
      })
      .catch((e) => console.warn('Portfolio sync note:', e));

    fetchTransfers()
      .then((t) => {
        if (t && t.length > 0) {
          setTransfers(t);
        }
      })
      .catch((e) => console.warn('Transfers sync note:', e));
  }, []);

  const handleExecuteMove = async () => {
    if (moveExecuted) return;
    setMoveExecuted(true);

    try {
      const res = await executeNextMove();
      setIdleChecking(res.newIdleChecking);
      setNetWorth((prev) => prev + res.transferredAmount);
      setTransfers((prev) => [res.transferItem, ...prev]);
      setToastMessage(res.message || '🎉 Move Executed! $450 routed to Index Funds. +$18,400 10-yr trajectory unlocked!');
    } catch (err) {
      console.warn('Backend execute-move offline, applying locally:', err);
      setIdleChecking((prev) => Math.max(0, prev - 450));
      setNetWorth((prev) => prev + 450);
      const newTransfer: AutoTransferItem = {
        id: `t-${Date.now()}`,
        name: 'Vanguard Index Fund (Auto)',
        subtitle: 'Surplus Sweep • Just now',
        amount: 450.0,
        status: 'Settled',
        icon: '⚡',
        date: 'Just now',
      };
      setTransfers((prev) => [newTransfer, ...prev]);
      setToastMessage('🎉 Move Executed! $450 routed to Index Funds. +$18,400 10-yr trajectory unlocked!');
    }

    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="relative w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-white/20">
          <span className="material-symbols-outlined text-secondary-fixed text-2xl">check_circle</span>
          <span className="font-headline-sm text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full bg-primary-fixed-dim/30 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-40 right-10 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-tertiary-fixed/30 blur-3xl -z-10" />

      {/* Top Greeting & Live Pulse Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg mb-space-lg pt-2">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-label-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              LIVE RADAR ACTIVE
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              • Updated 12 mins ago
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Good morning, Maya ✨
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Let’s see where your money’s headed today. All systems primed for wealth velocity.
          </p>
        </div>

        {/* Financial Health Score & Lumo Smart Banner Capsule */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] border border-outline-variant/30">
          {/* Circular Progress Ring (Score 84) */}
          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                className="text-surface-container-high"
                cx="40"
                cy="40"
                fill="none"
                r="32"
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                className="text-primary-container"
                cx="40"
                cy="40"
                fill="none"
                r="32"
                stroke="currentColor"
                strokeDasharray="201.06"
                strokeDashoffset="32.17"
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold leading-none">
                84
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-0.5">
                /100
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
                Prime Trajectory
              </span>
              <span
                className="material-symbols-outlined text-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xs">
              Top 6% in disciplined surplus allocation among peer age group.
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight Micro-Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-fixed/40 via-surface-container-lowest to-secondary-container/30 p-space-md mb-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-[0_4px_20px_-2px_rgba(108,76,241,0.06)] border border-primary-fixed/30">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold">
                Lumo Milestone Velocity
              </span>
              <span className="inline-flex px-2 py-0.5 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-secondary font-semibold">
                +3 Mos Ahead
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">
              At your current pace, you'll complete your{' '}
              <span className="text-primary font-bold">Emergency Cushion</span> 3 months ahead of
              target!
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-auto">
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-headline-sm text-headline-sm shadow-sm flex items-center gap-1.5"
          >
            <span>See Projection</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Master Bento Grid (12 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-space-lg">
        {/* BENTO 1: Consolidated Net Worth Card with Interactive Sparkline (Col 7) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] flex flex-col justify-between relative overflow-hidden transition-all duration-200 border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs mb-1">
                <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base">trending_up</span>
                </span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                  Consolidated Net Worth
                </span>
              </div>
              <div className="flex items-baseline gap-space-sm mt-1">
                <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold tracking-tight">
                  {formatCurrency(netWorth, currency, isPrivate)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-secondary font-headline-sm text-sm font-semibold">
                  <span className="material-symbols-outlined text-sm leading-none mr-0.5">
                    north_east
                  </span>
                  +14.2% YoY
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                +{formatCurrency(17680, currency, isPrivate)} added over past 12 months
              </span>
            </div>
            <div className="inline-flex bg-surface-container-low p-1 rounded-full text-on-surface-variant">
              {(['1Y', '3Y', 'ALL'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-label-sm font-label-sm rounded-full transition-all ${
                    timeRange === r
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'hover:text-on-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Projection Area Graph */}
          <div className="mt-space-lg relative w-full h-44">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 600 160"
            >
              <defs>
                <linearGradient id="primaryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#6c4cf1" stopOpacity="0.32" />
                  <stop offset="70%" stopColor="#6c4cf1" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#6c4cf1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Guide Grid Lines */}
              <line
                className="text-surface-container"
                stroke="currentColor"
                strokeDasharray="4 4"
                x1="0"
                x2="600"
                y1="40"
                y2="40"
              />
              <line
                className="text-surface-container"
                stroke="currentColor"
                strokeDasharray="4 4"
                x1="0"
                x2="600"
                y1="90"
                y2="90"
              />
              <line
                className="text-surface-container"
                stroke="currentColor"
                strokeDasharray="4 4"
                x1="0"
                x2="600"
                y1="140"
                y2="140"
              />
              {/* Shaded Area */}
              <path
                d="M 0,140 Q 90,135 150,115 T 300,95 T 450,55 T 600,20 L 600,160 L 0,160 Z"
                fill="url(#primaryGradient)"
              />
              {/* Continuous Line */}
              <path
                d="M 0,140 Q 90,135 150,115 T 300,95 T 450,55 T 600,20"
                fill="none"
                stroke="#532cd8"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
              {/* Highlight Point */}
              <circle cx="600" cy="20" fill="#532cd8" r="6" />
              <circle className="animate-ping" cx="600" cy="20" fill="#532cd8" opacity="0.25" r="12" />
            </svg>
            {/* Floating Micro Tag inside Chart */}
            <div className="absolute right-4 top-2 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-outline-variant/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-headline-sm text-xs font-bold text-on-surface">
                Oct '24: {formatCurrency(netWorth, currency, isPrivate, true)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-sm mt-space-sm text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
            <span>NOV '23 ({formatCurrency(125170, currency, isPrivate, true)})</span>
            <span>MAY '24 ({formatCurrency(133400, currency, isPrivate, true)})</span>
            <span className="text-primary font-bold">
              PROJECTED EOY ({formatCurrency(148200, currency, isPrivate, true)})
            </span>
          </div>
        </div>

        {/* BENTO 2: Next Best Move Card (Electric Violet Accent Card) (Col 5) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-5 bg-gradient-to-br from-primary-container via-primary to-primary-container text-on-primary rounded-3xl p-space-lg shadow-[0_16px_36px_-6px_rgba(108,76,241,0.35)] flex flex-col justify-between relative overflow-hidden transition-all duration-200">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex flex-col gap-space-sm relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm font-bold tracking-wider">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                NEXT BEST MOVE
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container bg-black/15 px-2 py-0.5 rounded-full font-semibold">
                High Impact
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-primary mt-space-xs leading-snug font-bold">
              Automate $450 into Index Funds before Friday
            </h2>
            <p className="font-body-md text-body-md text-on-primary/85">
              Unlocks an estimated{' '}
              <span className="text-secondary-fixed font-bold">+$18,400</span> over a 10-year
              compound window utilizing unused Checking buffer.
            </p>
          </div>

          <div className="pt-space-md relative z-10 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between bg-black/15 backdrop-blur-md rounded-2xl p-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed">savings</span>
                <span className="font-body-sm text-body-sm text-on-primary font-medium">
                  Idle Checking: {formatCurrency(idleChecking, currency, isPrivate)}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary-fixed font-semibold">
                {moveExecuted ? 'Optimized' : 'Safe to Move'}
              </span>
            </div>
            <button
              onClick={handleExecuteMove}
              disabled={moveExecuted}
              className={`w-full h-12 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-150 font-headline-sm text-headline-sm font-bold ${
                moveExecuted
                  ? 'bg-secondary text-white opacity-95 cursor-default'
                  : 'bg-surface-container-lowest text-primary hover:bg-white active:scale-95'
              }`}
            >
              <span>{moveExecuted ? 'Move Executed' : 'Execute Move'}</span>
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </button>
          </div>
        </div>

        {/* BENTO 3: Cashflow Summary Card (Col 7) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-8 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-base">payments</span>
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                Monthly Cashflow Flow
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold bg-secondary-container/30 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-xs">thumb_up</span> 43.3% SAVINGS RATE
            </span>
          </div>

          {/* 4 Metrics Split Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <div className="bg-surface-container-low rounded-2xl p-space-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Income</span>
              <span className="font-headline-md text-xl text-on-surface mt-1 font-bold">
                {formatCurrency(8200, currency, isPrivate)}
              </span>
              <span className="font-label-sm text-label-sm text-secondary mt-0.5">Direct Deposit</span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-space-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Expenses</span>
              <span className="font-headline-md text-xl text-on-surface mt-1 font-bold">
                {formatCurrency(4650, currency, isPrivate)}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">56.7% of total</span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-space-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Savings</span>
              <span className="font-headline-md text-xl text-secondary mt-1 font-bold">
                {formatCurrency(3550, currency, isPrivate)}
              </span>
              <span className="font-label-sm text-label-sm text-secondary mt-0.5">Above Target</span>
            </div>
            <div className="bg-primary-fixed/30 rounded-2xl p-space-sm flex flex-col">
              <span className="font-label-sm text-label-sm text-primary font-bold">Investable Surplus</span>
              <span className="font-headline-md text-xl text-primary mt-1 font-bold">
                {formatCurrency(2100, currency, isPrivate)}
              </span>
              <span className="font-label-sm text-label-sm text-primary/70 mt-0.5">Ready to Deploy</span>
            </div>
          </div>

          {/* Visual Flow Breakdown Bar */}
          <div className="mt-space-md flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
              <span>Cash allocation ratio</span>
              <span className="font-medium text-on-surface">57% Expenses • 43% Retained</span>
            </div>
            <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden flex">
              <div className="h-full bg-outline-variant rounded-l-full" style={{ width: '56.7%' }} />
              <div className="h-full bg-primary" style={{ width: '25.6%' }} />
              <div className="h-full bg-secondary rounded-r-full" style={{ width: '17.7%' }} />
            </div>
            <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" /> Living Costs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Investments
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> High-Yield Vault
              </span>
            </div>
          </div>
        </div>

        {/* BENTO 4: Spending Distribution Donut Card (Col 5) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-5 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-8 rounded-full bg-tertiary-fixed/40 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-base">pie_chart</span>
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                Spending Distribution
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">This Month</span>
          </div>

          {/* Donut Chart & Legend Composite */}
          <div className="flex items-center justify-center sm:justify-start gap-space-lg my-space-md">
            {/* Inline Donut SVG */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-low"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="14"
                />
                {/* Rent 34% */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#532cd8"
                  strokeDasharray="81 238"
                  strokeDashoffset="0"
                  strokeWidth="14"
                />
                {/* Investments 28% */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#006c4e"
                  strokeDasharray="67 238"
                  strokeDashoffset="-81"
                  strokeWidth="14"
                />
                {/* Discretionary 18% */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#6c4cf1"
                  strokeDasharray="43 238"
                  strokeDashoffset="-148"
                  strokeWidth="14"
                />
                {/* Groceries 14% */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#ffb3b0"
                  strokeDasharray="33 238"
                  strokeDashoffset="-191"
                  strokeWidth="14"
                />
                {/* Utilities 6% */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#c9c4d8"
                  strokeDasharray="14 238"
                  strokeDashoffset="-224"
                  strokeWidth="14"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-label-sm text-[10px] text-on-surface-variant leading-none font-bold">
                  TOTAL
                </span>
                <span className="font-headline-sm text-sm text-on-surface font-extrabold mt-0.5">
                  {formatCurrency(4650, currency, isPrivate, true)}
                </span>
              </div>
            </div>

            {/* Donut Categories Legend */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {INITIAL_SPENDING_CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="flex items-center gap-1.5 text-on-surface truncate text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-semibold text-on-surface text-xs">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('simulator', 'How do I optimize my monthly spending caps?')}
            className="w-full py-2 bg-surface-container-low hover:bg-surface-container-high rounded-full font-headline-sm text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span>Manage Category Caps</span>
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>
        </div>

        {/* BENTO 5: Active Life Milestones (Col 8) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] flex flex-col justify-between border border-outline-variant/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-base">flag</span>
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                Active Life Milestones
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-secondary font-label-sm text-label-sm font-bold">
                {goals.filter((g) => g.status !== 'attention').length} On Track
              </span>
              {goals.some((g) => g.status === 'attention') && (
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-bold">
                  1 Attention Needed
                </span>
              )}
            </div>
          </div>

          {/* Goals Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {goals.slice(0, 4).map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isAlert = goal.status === 'attention';

              return (
                <div
                  key={goal.id}
                  onClick={() => onNavigateTab('goals')}
                  className={`bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between gap-space-sm hover:bg-surface-container transition-all cursor-pointer border ${
                    isAlert ? 'border-tertiary/30' : 'border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="text-2xl">{goal.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-sm font-bold text-on-surface">
                          {goal.title}
                        </span>
                        <span
                          className={`font-label-sm text-xs font-semibold ${
                            isAlert ? 'text-tertiary flex items-center gap-1' : 'text-secondary'
                          }`}
                        >
                          {isAlert && (
                            <span className="material-symbols-outlined text-xs">warning</span>
                          )}
                          {goal.statusLabel}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-label-sm text-xs font-bold ${
                        isAlert ? 'text-tertiary' : 'text-on-surface-variant'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAlert ? 'bg-tertiary' : 'bg-secondary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>{formatCurrency(goal.currentAmount, currency, isPrivate)} saved</span>
                      <span className="font-bold text-on-surface">
                        {formatCurrency(goal.targetAmount, currency, isPrivate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO 6: Smart Automated Transfers (Col 4) */}
        <div className="col-span-1 md:col-span-8 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-base">sync_alt</span>
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                Auto-Piloted Transfers
              </span>
            </div>
            <span
              onClick={onOpenAddGoal}
              className="material-symbols-outlined text-on-surface-variant text-base cursor-pointer hover:text-on-surface"
              title="Add New Target"
            >
              add
            </span>
          </div>

          {/* Transfer Activity List */}
          <div className="flex flex-col gap-space-sm my-space-xs">
            {transfers.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-space-sm rounded-xl hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-xs font-bold text-on-surface">
                      {item.name}
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-xs font-bold text-on-surface">
                    +{formatCurrency(item.amount, currency, isPrivate)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-semibold ${
                      item.status === 'Settled'
                        ? 'bg-secondary-container/40 text-secondary'
                        : 'bg-primary-fixed text-primary'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('goals')}
            className="w-full py-2 bg-surface-container-low hover:bg-surface-container-high rounded-full font-headline-sm text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span>View All Automations</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Bottom Contextual Quick Bar */}
      <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.02)] gap-space-sm border border-outline-variant/30">
        <div className="flex items-center gap-space-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-xl">psychology</span>
          <span className="font-body-sm text-body-sm">
            Lumo regularly recalculates market volatility and adjusts your auto-transfer timelines.
          </span>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            onClick={() => onNavigateTab('simulator')}
            className="font-headline-sm text-sm text-primary hover:underline flex items-center gap-1 font-bold"
          >
            <span>Run Custom Simulation</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
      </div>
    </div>
  );
};
