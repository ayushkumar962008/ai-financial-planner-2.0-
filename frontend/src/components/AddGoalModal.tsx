import React, { useState } from 'react';
import { FinancialGoal } from '../types/lifepath';
import { Currency, CURRENCY_SYMBOLS } from '../utils/lifepathFormatters';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: FinancialGoal) => void;
  currency: Currency;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [targetAmount, setTargetAmount] = useState<number>(30000);
  const [currentAmount, setCurrentAmount] = useState<number>(5000);
  const [monthlyRequired, setMonthlyRequired] = useState<number>(500);
  const [targetYear, setTargetYear] = useState<number>(2027);
  const [horizon, setHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const iconOptions = ['🎯', '🛡️', '🏡', '✈️', '🇯🇵', '🚀', '🏪', '🎓', '💍', '🚗', '⭐', '👶'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      icon,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      monthlyRequired: Number(monthlyRequired),
      status: currentAmount >= targetAmount ? 'ahead' : 'on_track',
      statusLabel: 'Auto-contribution active',
      horizon,
      priority,
      targetYear: Number(targetYear),
      targetDateLabel: `Target ${targetYear}`,
      note: note.trim() || 'Dynamic milestone tracked by Lumo engine.',
      accountType: 'High-Yield & Index Allocations',
    };

    onAddGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">flag</span>
            </span>
            <div>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Create Life Milestone
              </h2>
              <span className="font-label-sm text-xs text-on-surface-variant">
                Lumo Dynamic Surplus Allocation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
          {/* Title & Icon Picker */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-20">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 bg-surface-container-low rounded-xl px-2 text-xl border border-outline-variant/30 focus:outline-none focus:border-primary"
              >
                {iconOptions.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electric Vehicle / Master's Degree"
                className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Target Amount & Current Saved */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Target Amount ({symbol})
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Current Saved ({symbol})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Monthly Required & Target Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Monthly Contribution ({symbol}/mo)
              </label>
              <input
                type="number"
                min="20"
                step="50"
                value={monthlyRequired}
                onChange={(e) => setMonthlyRequired(Number(e.target.value))}
                className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Target Year
              </label>
              <input
                type="number"
                min="2025"
                max="2060"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Horizon & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Time Horizon
              </label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value as 'short' | 'medium' | 'long')}
                className="w-full h-10 bg-surface-container-low rounded-xl px-2.5 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              >
                <option value="short">Short-term (0–3 yrs)</option>
                <option value="medium">Medium-term (3–10 yrs)</option>
                <option value="long">Long-term (10+ yrs)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
                Smart Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full h-10 bg-surface-container-low rounded-xl px-2.5 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
              >
                <option value="high">High (Funded First)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="low">Low (Discretionary)</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-xs text-on-surface-variant font-semibold">
              Description / Plan Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Allocation via Automated Monthly Sweep"
              className="w-full h-10 bg-surface-container-low rounded-xl px-3 font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-space-xs mt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-full font-headline-sm text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-headline-sm text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
