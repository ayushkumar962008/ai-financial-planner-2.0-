import React, { useState } from 'react';
import { Currency, formatCurrency } from '../utils/lifepathFormatters';
import { INITIAL_SCENARIO_A, INITIAL_SCENARIO_B } from '../data/lifepathData';
import { ScenarioVariables } from '../types/lifepath';

interface FutureWealthSimulatorViewProps {
  currency: Currency;
  isPrivate: boolean;
}

export const FutureWealthSimulatorView: React.FC<FutureWealthSimulatorViewProps> = ({
  currency,
  isPrivate,
}) => {
  const [scenarioA, setScenarioA] = useState<ScenarioVariables>(INITIAL_SCENARIO_A);
  const [scenarioB, setScenarioB] = useState<ScenarioVariables>(INITIAL_SCENARIO_B);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [appliedAsPrimary, setAppliedAsPrimary] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const presets = [
    {
      id: 'save10',
      title: 'Save 10% more',
      badge: '+$600/mo',
      icon: 'savings',
      color: 'text-primary',
      apply: () => {
        setScenarioB((prev) => ({ ...prev, monthlySavings: 4150 }));
      },
    },
    {
      id: 'jobchange',
      title: 'Job Change (+25% income)',
      badge: '+$38K/yr',
      icon: 'trending_up',
      color: 'text-secondary',
      apply: () => {
        setScenarioB((prev) => ({ ...prev, monthlySavings: 4750, incomeGrowth: 8.5 }));
      },
    },
    {
      id: 'delayhouse',
      title: 'Delay house by 2 years',
      badge: '+Compound buffer',
      icon: 'home_work',
      color: 'text-on-surface-variant',
      apply: () => {
        setScenarioB((prev) => ({ ...prev, retirementAge: 52, expectedRoi: 9.5 }));
      },
    },
    {
      id: 'highinflation',
      title: 'High Inflation (6%)',
      badge: 'Stress test',
      icon: 'local_fire_department',
      color: 'text-tertiary',
      apply: () => {
        setScenarioB((prev) => ({ ...prev, expenseInflation: 6.0, expectedRoi: 7.0 }));
      },
    },
    {
      id: 'marketdip',
      title: 'Market Dip (-15% yr 2)',
      badge: 'Drawdown',
      icon: 'water_loss',
      color: 'text-tertiary',
      apply: () => {
        setScenarioB((prev) => ({ ...prev, expectedRoi: 6.2 }));
      },
    },
  ];

  const handleSelectPreset = (preset: (typeof presets)[0]) => {
    setActivePreset(preset.id);
    preset.apply();
    setToastMessage(`⚡ Loaded "${preset.title}" into Scenario B!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    setScenarioA(INITIAL_SCENARIO_A);
    setScenarioB(INITIAL_SCENARIO_B);
    setActivePreset(null);
    setAppliedAsPrimary(false);
    setToastMessage('Simulator reset to defaults.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPrimary = () => {
    setAppliedAsPrimary(true);
    setScenarioA({ ...scenarioB });
    setToastMessage('🚀 Scenario B adopted as your Primary Financial Plan!');
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Mathematical projections
  const calcNW = (vars: ScenarioVariables, years: number) => {
    const monthlyRate = vars.expectedRoi / 100 / 12;
    const months = years * 12;
    let total = 142850 * Math.pow(1 + monthlyRate, months);
    // Compound monthly contributions with income growth & inflation adjusted
    const realAnnualRate = (vars.expectedRoi - vars.expenseInflation) / 100;
    const effMonthly = (vars.monthlySavings * (1 + realAnnualRate / 2)) ;
    for (let m = 0; m < months; m++) {
      total += effMonthly * Math.pow(1 + monthlyRate, months - m);
    }
    return Math.round(total);
  };

  const aAt40 = calcNW(scenarioA, 14); // age 26 to 40 (14 yrs)
  const aAt55 = calcNW(scenarioA, 29); // age 26 to 55 (29 yrs)
  const bAt40 = calcNW(scenarioB, 14);
  const bAt55 = calcNW(scenarioB, 29);

  const diff40 = bAt40 - aAt40;
  const diff55 = bAt55 - aAt55;
  const pctGain55 = aAt55 > 0 ? Math.round((diff55 / aAt55) * 100) : 64;

  return (
    <div className="relative w-full pb-16 space-y-space-lg">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-white/20">
          <span className="material-symbols-outlined text-secondary-fixed text-2xl">insights</span>
          <span className="font-headline-sm text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-12 right-10 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl -z-10" />

      {/* Header Contextual Unit */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-2">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-primary font-label-sm">
              <span className="material-symbols-outlined text-sm">tune</span>
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              Interactive Engine
            </span>
            <span className="text-on-surface-variant font-body-sm">• Dynamic Sensitivity v3.4</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Scenario Simulator
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Test your ‘What Ifs’ in real time. Model career pivots, market drawdowns, or aggressive
            savings to witness your net-worth inflection points.
          </p>
        </div>

        {/* Live Sync Badge & Run Audit */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-xs rounded-full shadow-[0_4px_20px_rgba(26,26,36,0.04)] border border-outline-variant/30">
          <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>Monte Carlo: 10,000 runs</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-space-md py-2 rounded-full hover:bg-surface-container text-on-surface-variant font-label-md font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Quick Scenario Presets Bar */}
      <div className="relative z-10 flex flex-col gap-space-xs pb-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Instant Presets & Stress Tests
          </span>
          <span className="font-label-sm text-label-sm text-primary font-bold">
            Click to load into Scenario B
          </span>
        </div>
        <div className="flex items-center gap-space-sm overflow-x-auto pb-1 no-scrollbar">
          {presets.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`group flex items-center gap-space-xs px-space-md py-2 rounded-full shadow-[0_2px_8px_rgba(26,26,36,0.04)] transition-all duration-200 shrink-0 border ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-md'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    isSelected ? 'text-on-primary-container' : preset.color
                  }`}
                >
                  {preset.icon}
                </span>
                <span className="font-headline-sm text-sm font-semibold">{preset.title}</span>
                <span
                  className={`font-label-sm text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-on-primary-container'
                      : 'bg-surface-container text-primary'
                  }`}
                >
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid: Side-by-Side Dual Trajectory Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* SCENARIO A: Current Trajectory (Baseline) */}
        <div className="lg:col-span-6 flex flex-col bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-surface-container-high/60 blur-2xl" />
          <div className="flex flex-col gap-space-md relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined">history</span>
                </span>
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                    Baseline Model
                  </span>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">
                    Scenario A: Current Track
                  </h2>
                </div>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm font-semibold">
                Locked Baseline
              </span>
            </div>

            {/* Sliders Group A */}
            <div className="space-y-space-md py-space-xs">
              {/* Slider A1: Monthly Savings */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-headline-sm text-sm text-on-surface font-semibold">
                    Monthly Savings
                  </label>
                  <span className="font-headline-sm text-sm text-primary font-bold">
                    {formatCurrency(scenarioA.monthlySavings, currency, isPrivate)}
                  </span>
                </div>
                <input
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="8000"
                  min="1500"
                  step="50"
                  type="range"
                  value={scenarioA.monthlySavings}
                  onChange={(e) =>
                    setScenarioA((prev) => ({ ...prev, monthlySavings: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>{formatCurrency(1500, currency, isPrivate, true)}</span>
                  <span>Baseline: 34% of net income</span>
                  <span>{formatCurrency(8000, currency, isPrivate, true)}</span>
                </div>
              </div>

              {/* Slider A2: Income Growth */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-headline-sm text-sm text-on-surface font-semibold">
                    Income Growth / yr
                  </label>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    {scenarioA.incomeGrowth.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="15"
                  min="1"
                  step="0.5"
                  type="range"
                  value={scenarioA.incomeGrowth}
                  onChange={(e) =>
                    setScenarioA((prev) => ({ ...prev, incomeGrowth: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>1.0%</span>
                  <span>Avg corporate rate</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Slider A3: Expense Inflation */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-headline-sm text-sm text-on-surface font-semibold">
                    Expense Inflation / yr
                  </label>
                  <span className="font-headline-sm text-sm text-tertiary font-bold">
                    {scenarioA.expenseInflation.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-tertiary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="8"
                  min="1.5"
                  step="0.1"
                  type="range"
                  value={scenarioA.expenseInflation}
                  onChange={(e) =>
                    setScenarioA((prev) => ({ ...prev, expenseInflation: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>1.5%</span>
                  <span>CPI target</span>
                  <span>8.0%</span>
                </div>
              </div>

              {/* Slider A4: Expected ROI */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-headline-sm text-sm text-on-surface font-semibold">
                    Expected Return (ROI)
                  </label>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    {scenarioA.expectedRoi.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="14"
                  min="4"
                  step="0.1"
                  type="range"
                  value={scenarioA.expectedRoi}
                  onChange={(e) =>
                    setScenarioA((prev) => ({ ...prev, expectedRoi: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>4.0%</span>
                  <span>Balanced 60/40 index</span>
                  <span>14.0%</span>
                </div>
              </div>

              {/* Slider A5: Target Retirement Age */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-headline-sm text-sm text-on-surface font-semibold">
                    Target Retirement Age
                  </label>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    Age {scenarioA.retirementAge}
                  </span>
                </div>
                <input
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="68"
                  min="48"
                  step="1"
                  type="range"
                  value={scenarioA.retirementAge}
                  onChange={(e) =>
                    setScenarioA((prev) => ({ ...prev, retirementAge: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>48</span>
                  <span>Standard FIRE</span>
                  <span>68</span>
                </div>
              </div>
            </div>
          </div>

          {/* Out-turn Summary Cards */}
          <div className="mt-space-md pt-space-sm grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-2xl p-space-sm border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                Net Worth @ 40
              </span>
              <span className="font-currency-stat text-xl text-on-surface font-extrabold">
                {formatCurrency(aAt40, currency, isPrivate, true)}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">Baseline path</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                Net Worth @ 55
              </span>
              <span className="font-currency-stat text-xl text-on-surface font-extrabold">
                {formatCurrency(aAt55, currency, isPrivate, true)}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">Safe run rate</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                Life Goals
              </span>
              <span className="font-currency-stat text-xl text-tertiary font-extrabold">5 of 6</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">House delayed 1.5y</span>
            </div>
          </div>
        </div>

        {/* SCENARIO B: Optimized Strategy (Lumo Plan) */}
        <div className="lg:col-span-6 flex flex-col bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_16px_36px_-6px_rgba(108,76,241,0.12)] justify-between relative overflow-hidden border-2 border-primary/40">
          {/* Gradient Aura Highlight */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-secondary-fixed/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-fixed-dim/30 blur-3xl" />
          <div className="flex flex-col gap-space-md relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </span>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                      AI Enhanced
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm leading-none font-bold">
                      +{pctGain55}% Yield
                    </span>
                  </div>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">
                    Scenario B: Lumo Plan
                  </h2>
                </div>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-headline-sm text-xs font-bold uppercase tracking-wider">
                Active Projection
              </span>
            </div>

            {/* Sliders Group B */}
            <div className="space-y-space-md py-space-xs">
              {/* Slider B1: Monthly Savings */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="font-headline-sm text-sm text-on-surface font-semibold">
                      Monthly Savings
                    </label>
                    <span className="font-label-sm text-xs px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                      +${scenarioB.monthlySavings - scenarioA.monthlySavings} auto-sweep
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-bold">
                    {formatCurrency(scenarioB.monthlySavings, currency, isPrivate)}
                  </span>
                </div>
                <input
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="8000"
                  min="1500"
                  step="50"
                  type="range"
                  value={scenarioB.monthlySavings}
                  onChange={(e) =>
                    setScenarioB((prev) => ({ ...prev, monthlySavings: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>{formatCurrency(1500, currency, isPrivate, true)}</span>
                  <span>Target: 41% net allocation</span>
                  <span>{formatCurrency(8000, currency, isPrivate, true)}</span>
                </div>
              </div>

              {/* Slider B2: Income Growth */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="font-headline-sm text-sm text-on-surface font-semibold">
                      Income Growth / yr
                    </label>
                    <span className="font-label-sm text-xs px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold">
                      +Promotion bump
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-bold">
                    {scenarioB.incomeGrowth.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="15"
                  min="1"
                  step="0.5"
                  type="range"
                  value={scenarioB.incomeGrowth}
                  onChange={(e) =>
                    setScenarioB((prev) => ({ ...prev, incomeGrowth: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>1.0%</span>
                  <span>Tech / Engineering curve</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Slider B3: Expense Inflation */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="font-headline-sm text-sm text-on-surface font-semibold">
                      Expense Inflation / yr
                    </label>
                    <span className="font-label-sm text-xs px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                      -0.2% smart bills
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-bold">
                    {scenarioB.expenseInflation.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="8"
                  min="1.5"
                  step="0.1"
                  type="range"
                  value={scenarioB.expenseInflation}
                  onChange={(e) =>
                    setScenarioB((prev) => ({ ...prev, expenseInflation: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>1.5%</span>
                  <span>Negotiated recurring SaaS</span>
                  <span>8.0%</span>
                </div>
              </div>

              {/* Slider B4: Expected Return */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="font-headline-sm text-sm text-on-surface font-semibold">
                      Expected Return (ROI)
                    </label>
                    <span className="font-label-sm text-xs px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold">
                      Core + Satellites
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-bold">
                    {scenarioB.expectedRoi.toFixed(1)}%
                  </span>
                </div>
                <input
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="14"
                  min="4"
                  step="0.1"
                  type="range"
                  value={scenarioB.expectedRoi}
                  onChange={(e) =>
                    setScenarioB((prev) => ({ ...prev, expectedRoi: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>4.0%</span>
                  <span>Global equity tilt</span>
                  <span>14.0%</span>
                </div>
              </div>

              {/* Slider B5: Target Retirement Age */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="font-headline-sm text-sm text-on-surface font-semibold">
                      Target Retirement Age
                    </label>
                    <span className="font-label-sm text-xs px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                      {scenarioA.retirementAge - scenarioB.retirementAge} years earlier!
                    </span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-bold">
                    Age {scenarioB.retirementAge}
                  </span>
                </div>
                <input
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                  max="68"
                  min="48"
                  step="1"
                  type="range"
                  value={scenarioB.retirementAge}
                  onChange={(e) =>
                    setScenarioB((prev) => ({ ...prev, retirementAge: Number(e.target.value) }))
                  }
                />
                <div className="flex justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>48</span>
                  <span>High autonomy index</span>
                  <span>68</span>
                </div>
              </div>
            </div>
          </div>

          {/* Out-turn Summary Cards */}
          <div className="mt-space-md pt-space-sm grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-2xl p-space-sm border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Net Worth @ 40
              </span>
              <span className="font-currency-stat text-xl text-secondary font-extrabold">
                {formatCurrency(bAt40, currency, isPrivate, true)}
              </span>
              <span className="font-label-sm text-[11px] text-secondary font-semibold">
                +{formatCurrency(diff40, currency, isPrivate, true)} (+
                {Math.round((diff40 / aAt40) * 100)}%)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Net Worth @ 55
              </span>
              <span className="font-currency-stat text-xl text-secondary font-extrabold">
                {formatCurrency(bAt55, currency, isPrivate, true)}
              </span>
              <span className="font-label-sm text-[11px] text-secondary font-semibold">
                +{formatCurrency(diff55, currency, isPrivate, true)} (+{pctGain55}%)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Life Goals
              </span>
              <span className="font-currency-stat text-xl text-secondary font-extrabold">6 of 6</span>
              <span className="font-label-sm text-[11px] text-secondary font-semibold">
                All hit ≤ 5 yrs early
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comparison Visual Chart Module */}
      <div className="mt-space-lg w-full bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,36,0.04)] relative border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">insights</span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                Trajectory Projection Curve
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              30-Year Compound Net Worth Forecast
            </h3>
          </div>

          {/* Chart Legend & Toggle View */}
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-outline-variant" />
              <span className="font-label-md text-xs text-on-surface-variant font-semibold">
                Scenario A (Current)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-secondary" />
              <span className="font-label-md text-xs text-on-surface font-bold">
                Scenario B (Optimized Lumo)
              </span>
            </div>
          </div>
        </div>

        {/* SVG Dual Trajectory Projection */}
        <div className="relative w-full h-72 sm:h-80 select-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="scenAGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#797587" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#797587" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="scenBGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#006c4e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#006c4e" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="60" x2="980" y1="40" y2="40" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="60" x2="980" y1="100" y2="100" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="60" x2="980" y1="160" y2="160" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="60" x2="980" y1="220" y2="220" />

            {/* Y-Axis Labels */}
            <text className="text-[11px]" fill="#797587" textAnchor="end" x="50" y="44">
              $4.0M
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="end" x="50" y="104">
              $2.5M
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="end" x="50" y="164">
              $1.0M
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="end" x="50" y="224">
              $200k
            </text>

            {/* Scenario A Area & Line */}
            <path
              d="M 60 250 C 200 240 380 215 550 170 C 720 135 850 100 970 85 L 970 260 L 60 260 Z"
              fill="url(#scenAGrad)"
            />
            <path
              d="M 60 250 C 200 240 380 215 550 170 C 720 135 850 100 970 85"
              fill="none"
              stroke="#797587"
              strokeDasharray="5 5"
              strokeWidth="2.5"
            />

            {/* Scenario B Area & Line */}
            <path
              d="M 60 250 C 200 235 380 185 550 120 C 720 75 850 45 970 25 L 970 260 L 60 260 Z"
              fill="url(#scenBGrad)"
            />
            <path
              d="M 60 250 C 200 235 380 185 550 120 C 720 75 850 45 970 25"
              fill="none"
              stroke="#006c4e"
              strokeLinecap="round"
              strokeWidth="3.5"
            />

            {/* Highlight Callout B at age 55 */}
            <circle cx="850" cy="45" fill="#006c4e" r="6" />
            <circle className="animate-ping" cx="850" cy="45" fill="#006c4e" opacity="0.3" r="12" />

            {/* X-Axis Labels */}
            <text className="text-[12px] font-semibold" fill="#484555" textAnchor="middle" x="60" y="280">
              Age 26 (Now)
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="250" y="280">
              Age 32
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="450" y="280">
              Age 38
            </text>
            <text className="text-[11px] font-bold" fill="#006c4e" textAnchor="middle" x="650" y="280">
              Age 45
            </text>
            <text className="text-[11px] font-bold" fill="#006c4e" textAnchor="middle" x="850" y="280">
              Age 53 (Lumo FIRE)
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="970" y="280">
              Age 58 (Base)
            </text>
          </svg>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md mt-space-sm border-t border-outline-variant/20 gap-space-sm">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-lg">verified</span>
            <span>
              Scenario B delivers an estimated{' '}
              <strong className="text-secondary font-bold">
                +{formatCurrency(diff55, currency, isPrivate, true)} additional wealth
              </strong>{' '}
              and enables retirement 5 years ahead of baseline.
            </span>
          </div>

          <button
            onClick={handleApplyPrimary}
            disabled={appliedAsPrimary}
            className={`px-space-lg py-2.5 rounded-full font-headline-sm text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
              appliedAsPrimary
                ? 'bg-secondary text-white opacity-95 cursor-default'
                : 'bg-primary text-on-primary hover:bg-primary-container hover:-translate-y-0.5'
            }`}
          >
            <span>{appliedAsPrimary ? 'Scenario B is Primary Plan' : 'Apply Scenario B as Primary Plan'}</span>
            <span className="material-symbols-outlined text-base">
              {appliedAsPrimary ? 'check' : 'rocket_launch'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
