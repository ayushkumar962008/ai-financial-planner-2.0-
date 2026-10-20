import React, { useState } from 'react';
import { FinancialGoal } from '../types/lifepath';
import { Currency, formatCurrency } from '../utils/lifepathFormatters';

interface GoalsPlannerViewProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: FinancialGoal) => void;
  currency: Currency;
  isPrivate: boolean;
  onOpenAddGoal: () => void;
}

export const GoalsPlannerView: React.FC<GoalsPlannerViewProps> = ({
  goals,
  currency,
  isPrivate,
  onOpenAddGoal,
}) => {
  const [filter, setFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [activeGoalList, setActiveGoalList] = useState<FinancialGoal[]>(goals);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [selectedGoalDetails, setSelectedGoalDetails] = useState<FinancialGoal | null>(null);

  // Synchronize when goals prop changes
  React.useEffect(() => {
    setActiveGoalList(goals);
  }, [goals]);

  const filteredGoals =
    filter === 'all' ? activeGoalList : activeGoalList.filter((g) => g.horizon === filter);

  const shortGoals = activeGoalList.filter((g) => g.horizon === 'short');
  const mediumGoals = activeGoalList.filter((g) => g.horizon === 'medium');
  const longGoals = activeGoalList.filter((g) => g.horizon === 'long');

  const totalMonthlySurplus = activeGoalList.reduce((acc, g) => acc + g.monthlyRequired, 0);

  const handleDepositMore = (goalId: string, amount: number) => {
    setActiveGoalList((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
      )
    );
  };

  return (
    <div className="relative w-full pb-16 space-y-space-lg">
      {/* Subtle Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-10 left-1/4 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-48 right-10 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl -z-10" />

      {/* Header & Summary Meta Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Milestone Orchestrator
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm">
              • Real-time auto-rebalance
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Your Life Milestones
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Lumo dynamically balances monthly surplus across time horizons, optimizing liquidity, tax
            efficiency, and priority locks.
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-full shadow-sm border border-outline-variant/30">
            <span
              className="material-symbols-outlined text-secondary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sync
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
              Surplus Auto-Routed:
            </span>
            <span className="font-headline-sm text-sm text-secondary font-bold">
              {formatCurrency(totalMonthlySurplus || 4800, currency, isPrivate)}/mo
            </span>
          </div>
          <button
            onClick={onOpenAddGoal}
            className="flex items-center gap-space-xs bg-primary text-on-primary px-space-lg py-2.5 rounded-full font-headline-sm text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Add New Goal</span>
          </button>
        </div>
      </div>

      {/* Smart Priority Activated Ambient Card */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-primary-container" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md pl-space-xs">
          <div className="flex items-start md:items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Smart Priority Activated
                </span>
                <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  Active Engine
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                When monthly surplus fluctuates, funding flows first to{' '}
                <strong className="text-on-surface font-semibold">
                  High Priority goals (Emergency Fund & Home)
                </strong>{' '}
                to protect compounding and maintain lifestyle stability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => setRulesModalOpen(true)}
              className="px-space-md py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors"
            >
              Configure Rules
            </button>
          </div>
        </div>
      </div>

      {/* Filter Pills Bar & Horizon Tab Switches */}
      <div className="flex items-center justify-between gap-space-md pb-space-xs flex-wrap">
        <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Milestones', count: activeGoalList.length },
              { id: 'short', label: 'Short-term (0–3 yrs)', count: shortGoals.length },
              { id: 'medium', label: 'Medium-term (3–10 yrs)', count: mediumGoals.length },
              { id: 'long', label: 'Long-term (10+ yrs)', count: longGoals.length },
            ] as const
          ).map((t) => {
            const isActive = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-full font-headline-sm text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-outline-variant/30'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                    isActive ? 'bg-surface-container-lowest/20' : 'bg-surface-container'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary" /> On Track:{' '}
            {activeGoalList.filter((g) => g.status !== 'attention').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary" /> Review:{' '}
            {activeGoalList.filter((g) => g.status === 'attention').length}
          </span>
        </div>
      </div>

      {/* Main Workspace Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md items-start">
        {/* SHORT-TERM HORIZON (0-3 Years) */}
        {(filter === 'all' || filter === 'short') && (
          <div className="flex flex-col gap-space-md bg-surface-container-low/60 p-space-sm rounded-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-space-xs pt-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Short-term
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">0–3 yrs</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-semibold border border-outline-variant/20">
                {formatCurrency(
                  shortGoals.reduce((s, g) => s + g.monthlyRequired, 0),
                  currency,
                  isPrivate
                )}
                /mo
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {shortGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalDetails(goal)}
                    className="group relative bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-outline-variant/30"
                  >
                    <div className="flex items-start justify-between mb-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-xl">
                          {goal.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                            {goal.title}
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant">
                            {goal.accountType || 'Liquid High-Yield HYSA'}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-base">
                        drag_indicator
                      </span>
                    </div>

                    {/* Progress Gauge */}
                    <div className="flex items-center justify-between gap-space-sm bg-surface-container-low/40 rounded-xl p-space-sm mb-space-sm border border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">
                          Saved / Target
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-headline-md text-lg text-on-surface font-extrabold">
                            {formatCurrency(goal.currentAmount, currency, isPrivate)}
                          </span>
                          <span className="font-body-sm text-xs text-on-surface-variant">
                            / {formatCurrency(goal.targetAmount, currency, isPrivate, true)}
                          </span>
                        </div>
                      </div>

                      {/* Inline SVG Gauge */}
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-surface-variant"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className="text-secondary"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${pct}, 100`}
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                        </svg>
                        <span className="absolute font-label-sm text-xs text-secondary font-bold">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-space-xs text-on-surface-variant">
                      <div className="flex items-center gap-1 font-label-md text-xs">
                        <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                        <span>
                          Req:{' '}
                          <strong className="text-on-surface">
                            {formatCurrency(goal.monthlyRequired, currency, isPrivate)}/mo
                          </strong>
                        </span>
                      </div>
                      <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                        {goal.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MEDIUM-TERM HORIZON (3-10 Years) */}
        {(filter === 'all' || filter === 'medium') && (
          <div className="flex flex-col gap-space-md bg-surface-container-low/60 p-space-sm rounded-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-space-xs pt-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Medium-term
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">3–10 yrs</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-semibold border border-outline-variant/20">
                {formatCurrency(
                  mediumGoals.reduce((s, g) => s + g.monthlyRequired, 0),
                  currency,
                  isPrivate
                )}
                /mo
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {mediumGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                const isAlert = goal.status === 'attention';

                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalDetails(goal)}
                    className={`group relative bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
                      isAlert ? 'border-tertiary/40 ring-1 ring-tertiary/20' : 'border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                            isAlert ? 'bg-tertiary-fixed text-tertiary' : 'bg-primary-fixed text-primary'
                          }`}
                        >
                          {goal.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                            {goal.title}
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant">
                            {goal.accountType || 'Treasury & Index Allocations'}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-base">
                        drag_indicator
                      </span>
                    </div>

                    {/* Progress Gauge */}
                    <div className="flex items-center justify-between gap-space-sm bg-surface-container-low/40 rounded-xl p-space-sm mb-space-sm border border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">
                          Saved / Target
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-headline-md text-lg text-on-surface font-extrabold">
                            {formatCurrency(goal.currentAmount, currency, isPrivate)}
                          </span>
                          <span className="font-body-sm text-xs text-on-surface-variant">
                            / {formatCurrency(goal.targetAmount, currency, isPrivate, true)}
                          </span>
                        </div>
                      </div>

                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-surface-variant"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className={isAlert ? 'text-tertiary' : 'text-primary'}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${pct}, 100`}
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                        </svg>
                        <span
                          className={`absolute font-label-sm text-xs font-bold ${
                            isAlert ? 'text-tertiary' : 'text-primary'
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-space-xs text-on-surface-variant">
                      <div className="flex items-center gap-1 font-label-md text-xs">
                        <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                        <span>
                          Req:{' '}
                          <strong className="text-on-surface">
                            {formatCurrency(goal.monthlyRequired, currency, isPrivate)}/mo
                          </strong>
                        </span>
                      </div>
                      <span
                        className={`px-space-xs py-0.5 rounded-full font-label-sm text-xs font-semibold ${
                          isAlert
                            ? 'bg-tertiary-fixed text-tertiary flex items-center gap-0.5'
                            : 'bg-primary-fixed text-primary'
                        }`}
                      >
                        {isAlert && (
                          <span className="material-symbols-outlined text-[10px]">warning</span>
                        )}
                        {goal.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LONG-TERM HORIZON (10+ Years) */}
        {(filter === 'all' || filter === 'long') && (
          <div className="flex flex-col gap-space-md bg-surface-container-low/60 p-space-sm rounded-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-space-xs pt-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Long-term
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">10+ yrs</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-semibold border border-outline-variant/20">
                {formatCurrency(
                  longGoals.reduce((s, g) => s + g.monthlyRequired, 0),
                  currency,
                  isPrivate
                )}
                /mo
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {longGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoalDetails(goal)}
                    className="group relative bg-gradient-to-br from-surface-container-lowest to-primary-fixed/20 rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-primary/30"
                  >
                    <div className="flex items-start justify-between mb-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl">
                          {goal.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                            {goal.title}
                          </span>
                          <span className="font-label-sm text-xs text-on-surface-variant">
                            Target: {goal.targetDateLabel}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline text-base">
                        drag_indicator
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-space-sm bg-surface-container-lowest/80 rounded-xl p-space-sm mb-space-sm border border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">
                          Projected Portfolio
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-headline-md text-lg text-primary font-extrabold">
                            {formatCurrency(goal.targetAmount, currency, isPrivate, true)}
                          </span>
                        </div>
                      </div>

                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-surface-variant"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          />
                          <path
                            className="text-primary-container"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="94, 100"
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                        </svg>
                        <span className="absolute font-label-sm text-xs text-primary font-bold">
                          94%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-space-xs text-on-surface-variant">
                      <div className="flex items-center gap-1 font-label-md text-xs">
                        <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                        <span>
                          Monthly DCA:{' '}
                          <strong className="text-on-surface">
                            {formatCurrency(goal.monthlyRequired, currency, isPrivate)}/mo
                          </strong>
                        </span>
                      </div>
                      <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-xs font-semibold">
                        {goal.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Goal Details Drawer / Modal */}
      {selectedGoalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedGoalDetails.icon}</span>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">
                    {selectedGoalDetails.title}
                  </h3>
                  <span className="font-label-sm text-xs text-on-surface-variant">
                    {selectedGoalDetails.targetDateLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGoalDetails(null)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant">Target Amount</span>
                <span className="font-bold text-on-surface">
                  {formatCurrency(selectedGoalDetails.targetAmount, currency, isPrivate)}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant">Current Balance</span>
                <span className="font-bold text-secondary">
                  {formatCurrency(selectedGoalDetails.currentAmount, currency, isPrivate)}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface-variant">Required Monthly Velocity</span>
                <span className="font-bold text-primary">
                  {formatCurrency(selectedGoalDetails.monthlyRequired, currency, isPrivate)}/mo
                </span>
              </div>
              <p className="text-xs text-on-surface-variant bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                {selectedGoalDetails.note}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  handleDepositMore(selectedGoalDetails.id, 500);
                  setSelectedGoalDetails(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-secondary text-white font-headline-sm text-xs font-bold shadow-sm hover:opacity-95"
              >
                + Quick Deposit $500
              </button>
              <button
                onClick={() => setSelectedGoalDetails(null)}
                className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface font-headline-sm text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Configuration Modal */}
      {rulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">tune</span>
                </span>
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Lumo Smart Priority Rules
                </h3>
              </div>
              <button
                onClick={() => setRulesModalOpen(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-on-surface-variant">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="font-bold text-on-surface text-sm block mb-1">
                  1. Capital Preservation Cascade
                </span>
                High-priority goals (Emergency Fund, Debt pay-down) always receive 100% of their
                scheduled allocation before discretionary goals (Tokyo Sabbatical).
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="font-bold text-on-surface text-sm block mb-1">
                  2. Dynamic Inflation Shield
                </span>
                Contributions automatically escalate by 4.5% every January to counteract purchasing
                power decay.
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="font-bold text-on-surface text-sm block mb-1">
                  3. Windfall & Surplus Auto-Sweep
                </span>
                Checking balances exceeding $2,500 are automatically queued for allocation into
                highest-yield deficient milestones.
              </div>
            </div>

            <button
              onClick={() => setRulesModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-xs font-bold"
            >
              Save & Apply Rules
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
