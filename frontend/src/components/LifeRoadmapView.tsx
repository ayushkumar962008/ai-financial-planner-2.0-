import React, { useState, useRef, useEffect } from 'react';
import { Currency, formatCurrency } from '../utils/lifepathFormatters';
import { INITIAL_ROADMAP_MILESTONES } from '../data/lifepathData';
import { LifeRoadmapMilestone } from '../types/lifepath';
import { fetchRoadmap, applyRoadmapOption } from '../services/api';

interface LifeRoadmapViewProps {
  currency: Currency;
  isPrivate: boolean;
}

export const LifeRoadmapView: React.FC<LifeRoadmapViewProps> = ({
  currency,
  isPrivate,
}) => {
  // Interactive Simulation Variables State
  const [savings, setSavings] = useState(3550);
  const [growth, setGrowth] = useState(5.5);
  const [inflation, setInflation] = useState(3.2);
  const [returnRate, setReturnRate] = useState(8.5);

  const [milestones, setMilestones] = useState<LifeRoadmapMilestone[]>(INITIAL_ROADMAP_MILESTONES);
  const [optionApplied, setOptionApplied] = useState<'A' | 'B' | null>(null);
  const [activeNode, setActiveNode] = useState<number | null>(2031);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync with persistent backend roadmap data
  useEffect(() => {
    fetchRoadmap()
      .then((serverMilestones) => {
        if (serverMilestones && serverMilestones.length > 0) {
          setMilestones(serverMilestones);
          // Check if option was already applied
          const home2031 = serverMilestones.find((m) => m.year === 2031);
          if (home2031 && home2031.status === 'on_track') {
            setOptionApplied('A');
          }
        }
      })
      .catch((e) => console.warn('Roadmap sync note:', e));
  }, []);

  const handleReset = () => {
    setSavings(3550);
    setGrowth(5.5);
    setInflation(3.2);
    setReturnRate(8.5);
    setOptionApplied(null);
    setMilestones(INITIAL_ROADMAP_MILESTONES);
    setToastMessage('Roadmap simulation reset to baseline.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyOptionA = async () => {
    setSavings((prev) => prev + 210);
    setOptionApplied('A');
    setMilestones((prev) =>
      prev.map((m) =>
        m.year === 2031
          ? {
              ...m,
              allocatedAmount: 150000,
              status: 'on_track',
              deficitAmount: 0,
              note: 'Gap resolved: monthly savings increased by +$210/mo.',
            }
          : m
      )
    );
    try {
      await applyRoadmapOption('A');
    } catch (err) {
      console.warn('Backend roadmap option note:', err);
    }
    setToastMessage('✅ Option A Applied! Monthly savings boosted by +$210/mo. 2031 Home Gap closed!');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleApplyOptionB = async () => {
    setOptionApplied('B');
    setMilestones((prev) =>
      prev.map((m) =>
        m.year === 2031
          ? {
              ...m,
              year: 2032,
              age: 33,
              allocatedAmount: 150000,
              status: 'on_track',
              deficitAmount: 0,
              note: 'Horizon extended to Q1 2032 with zero monthly sacrifice.',
            }
          : m
      )
    );
    try {
      await applyRoadmapOption('B');
    } catch (err) {
      console.warn('Backend roadmap option note:', err);
    }
    setToastMessage('✅ Option B Applied! Target extended by 8 months. Feasibility raised to 96.5%!');
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Dynamic calculations
  const feasibility = Math.min(
    99.2,
    Math.max(
      60,
      88.4 +
        (savings - 3550) * 0.015 +
        (growth - 5.5) * 1.2 -
        (inflation - 3.2) * 2.5 +
        (returnRate - 8.5) * 1.8 +
        (optionApplied ? 8 : 0)
    )
  ).toFixed(1);

  const currentGap = optionApplied ? 0 : Math.max(0, Math.round(24500 - (savings - 3550) * 12));

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full pb-16 space-y-space-lg">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-white/20">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <span className="font-headline-sm text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-48 right-10 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl -z-10" />

      {/* Top Headline & Action Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              AI Monte Carlo Engine v4.2
            </span>
            <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              Live Projection Active
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
            Life Roadmap & Milestones
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Visualizing your journey from age 26 to 56. Stress-test monthly velocity, inflation shifts,
            and real-time capital gaps.
          </p>
        </div>

        {/* Quick Summary Stat Cards */}
        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">flag</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                Target Nest Egg
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {formatCurrency(2850000, currency, isPrivate)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                Roadmap Feasibility
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary font-extrabold">
                {feasibility}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Interactive Simulation Controls Bento Strip */}
      <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md border border-outline-variant/30">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">tune</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Interactive Simulation Variables
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
              — drag sliders to dynamically recast projection curves
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container transition-colors font-semibold"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Slider 1: Monthly Savings */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">
                Monthly Savings
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {formatCurrency(savings, currency, isPrivate)}
                <span className="text-xs font-normal text-on-surface-variant">/mo</span>
              </span>
            </div>
            <div className="mt-space-sm space-y-1">
              <input
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                max="6000"
                min="1500"
                step="50"
                type="range"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>{formatCurrency(1500, currency, isPrivate, true)}</span>
                <span>{formatCurrency(3500, currency, isPrivate, true)}</span>
                <span>{formatCurrency(6000, currency, isPrivate, true)}</span>
              </div>
            </div>
          </div>

          {/* Slider 2: Annual Income Growth */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">
                Income Growth Rate
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                {growth.toFixed(1)}%
                <span className="text-xs font-normal text-on-surface-variant">/yr</span>
              </span>
            </div>
            <div className="mt-space-sm space-y-1">
              <input
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                max="12.0"
                min="1.0"
                step="0.5"
                type="range"
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>1.0%</span>
                <span>6.0%</span>
                <span>12.0%</span>
              </div>
            </div>
          </div>

          {/* Slider 3: Inflation Rate */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">
                Estimated Inflation
              </span>
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                {inflation.toFixed(1)}%
                <span className="text-xs font-normal text-on-surface-variant">/yr</span>
              </span>
            </div>
            <div className="mt-space-sm space-y-1">
              <input
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
                max="7.0"
                min="1.5"
                step="0.1"
                type="range"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>1.5%</span>
                <span>3.5%</span>
                <span>7.0%</span>
              </div>
            </div>
          </div>

          {/* Slider 4: Investment Return */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">
                Portfolio Return
              </span>
              <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
                {returnRate.toFixed(1)}%
                <span className="text-xs font-normal text-on-surface-variant">/yr</span>
              </span>
            </div>
            <div className="mt-space-sm space-y-1">
              <input
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                max="14.0"
                min="4.0"
                step="0.25"
                type="range"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>4.0%</span>
                <span>8.5%</span>
                <span>14.0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dual Line Chart Visualization: Current Trajectory vs Goal Path */}
      <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-md">
          <div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Capital Accumulation Curve
              </span>
              {currentGap > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  2031 Home Gap: -{formatCurrency(currentGap, currency, isPrivate)}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  All Milestones Fully Funded
                </span>
              )}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Compound projection adjusted for nominal wage step-ups and asset yield variance.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Goal Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 rounded-full bg-primary-container border-dashed" />
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Current Trajectory
              </span>
            </div>
            {currentGap > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-2 rounded bg-tertiary-fixed-dim/50" />
                <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                  Deficit Zone
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SVG Dual Line Chart with Coral Gap shading */}
        <div className="relative w-full h-72 sm:h-80 select-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 320">
            <defs>
              <linearGradient id="goalGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#006c4e" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#006c4e" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="trajectoryGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6c4cf1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#6c4cf1" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="gapGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffb3b0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffb3b0" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="50" x2="980" y1="40" y2="40" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="50" x2="980" y1="110" y2="110" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="50" x2="980" y1="180" y2="180" />
            <line stroke="#efecfb" strokeDasharray="4 4" strokeWidth="1.5" x1="50" x2="980" y1="250" y2="250" />

            {/* Y-Axis Value Labels */}
            <text className="text-[11px] font-sans font-medium" fill="#797587" textAnchor="end" x="40" y="44">
              $3.0M
            </text>
            <text className="text-[11px] font-sans font-medium" fill="#797587" textAnchor="end" x="40" y="114">
              $1.5M
            </text>
            <text className="text-[11px] font-sans font-medium" fill="#797587" textAnchor="end" x="40" y="184">
              $500k
            </text>
            <text className="text-[11px] font-sans font-medium" fill="#797587" textAnchor="end" x="40" y="254">
              $50k
            </text>

            {/* Deficit Shading Band (when gap > 0) */}
            {currentGap > 0 && (
              <path
                d="M 230 236 C 260 220 285 208 340 185 L 340 215 C 285 238 260 248 230 250 Z"
                fill="url(#gapGrad)"
              />
            )}

            {/* Goal Path Area & Line (Ideal) */}
            <path
              d="M 60 265 C 150 255 220 238 310 200 C 400 160 550 120 700 80 C 850 48 920 38 970 32 L 970 270 L 60 270 Z"
              fill="url(#goalGrad)"
            />
            <path
              d="M 60 265 C 150 255 220 238 310 200 C 400 160 550 120 700 80 C 850 48 920 38 970 32"
              fill="none"
              stroke="#006c4e"
              strokeLinecap="round"
              strokeWidth="3.5"
            />

            {/* Current Trajectory Area & Line */}
            <path
              d={
                currentGap === 0
                  ? 'M 60 265 C 150 255 220 238 310 200 C 400 155 550 110 700 70 C 850 42 920 34 970 28 L 970 270 L 60 270 Z'
                  : 'M 60 265 C 150 258 220 248 310 226 C 400 188 550 142 700 96 C 850 62 920 48 970 42 L 970 270 L 60 270 Z'
              }
              fill="url(#trajectoryGrad)"
            />
            <path
              d={
                currentGap === 0
                  ? 'M 60 265 C 150 255 220 238 310 200 C 400 155 550 110 700 70 C 850 42 920 34 970 28'
                  : 'M 60 265 C 150 258 220 248 310 226 C 400 188 550 142 700 96 C 850 62 920 48 970 42'
              }
              fill="none"
              stroke="#6c4cf1"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeWidth="3"
            />

            {/* Deficit Callout Pointer */}
            {currentGap > 0 ? (
              <g transform="translate(290, 160)">
                <circle cx="0" cy="45" fill="#ba1a1a" r="5" />
                <circle className="animate-ping" cx="0" cy="45" fill="#ba1a1a" opacity="0.2" r="11" />
                <rect
                  fill="#ffffff"
                  filter="drop-shadow(0 4px 10px rgba(0,0,0,0.08))"
                  height="34"
                  rx="8"
                  width="130"
                  x="-65"
                  y="-5"
                />
                <text
                  className="text-[11px] font-sans"
                  fill="#ba1a1a"
                  fontWeight="700"
                  textAnchor="middle"
                  x="0"
                  y="12"
                >
                  2031 Home Downpay
                </text>
                <text
                  className="text-[10px] font-sans"
                  fill="#484555"
                  fontWeight="500"
                  textAnchor="middle"
                  x="0"
                  y="24"
                >
                  Deficit -{formatCurrency(currentGap, currency, isPrivate, true)}
                </text>
              </g>
            ) : (
              <g transform="translate(290, 160)">
                <circle cx="0" cy="40" fill="#006c4e" r="5" />
                <rect
                  fill="#ffffff"
                  filter="drop-shadow(0 4px 10px rgba(0,0,0,0.08))"
                  height="34"
                  rx="8"
                  width="130"
                  x="-65"
                  y="-5"
                />
                <text
                  className="text-[11px] font-sans"
                  fill="#006c4e"
                  fontWeight="700"
                  textAnchor="middle"
                  x="0"
                  y="12"
                >
                  2031 Home Downpay
                </text>
                <text
                  className="text-[10px] font-sans"
                  fill="#006c4e"
                  fontWeight="500"
                  textAnchor="middle"
                  x="0"
                  y="24"
                >
                  Fully Funded! ✨
                </text>
              </g>
            )}

            {/* Interactive Milestone Nodes */}
            <circle
              className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              cx="60"
              cy="265"
              fill="#006c4e"
              r="5.5"
              onClick={() => setActiveNode(2025)}
            />
            <circle
              className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              cx="150"
              cy="255"
              fill="#006c4e"
              r="5.5"
              onClick={() => setActiveNode(2027)}
            />
            <circle
              className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              cx="220"
              cy="238"
              fill="#006c4e"
              r="5.5"
              onClick={() => setActiveNode(2029)}
            />
            <circle
              className="cursor-pointer"
              cx="310"
              cy={currentGap > 0 ? '226' : '200'}
              fill={currentGap > 0 ? '#ba1a1a' : '#006c4e'}
              r="6.5"
              stroke="#ffffff"
              strokeWidth="2"
              onClick={() => setActiveNode(2031)}
            />
            <circle
              className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              cx="550"
              cy="130"
              fill="#006c4e"
              r="5.5"
              onClick={() => setActiveNode(2038)}
            />
            <circle
              className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              cx="920"
              cy="42"
              fill="#532cd8"
              r="7"
              stroke="#ffffff"
              strokeWidth="2.5"
              onClick={() => setActiveNode(2052)}
            />

            {/* X-Axis Labels */}
            <text className="text-[12px] font-semibold" fill="#484555" textAnchor="middle" x="60" y="295">
              2025
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="150" y="295">
              2027
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="220" y="295">
              2029
            </text>
            <text
              className={`text-[11px] font-bold ${currentGap > 0 ? 'fill-[#ba1a1a]' : 'fill-[#006c4e]'}`}
              textAnchor="middle"
              x="310"
              y="295"
            >
              2031
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="550" y="295">
              2038
            </text>
            <text className="text-[11px]" fill="#797587" textAnchor="middle" x="750" y="295">
              2045
            </text>
            <text className="text-[12px] font-bold" fill="#532cd8" textAnchor="middle" x="920" y="295">
              2052 (Retire)
            </text>
          </svg>
        </div>
      </div>

      {/* 3. Horizontal Scrollable Milestone Timeline (2025 to 2055) */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary">timeline</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Life Roadmap Milestones
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
              Age 26 — 56
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container transition-all border border-outline-variant/30"
              title="Scroll Left"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container transition-all border border-outline-variant/30"
              title="Scroll Right"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-space-md overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar"
        >
          {milestones.map((m) => {
            const isAlert = m.status === 'alert';
            const isNorthStar = m.status === 'north_star';
            const pct = Math.min(100, Math.round((m.allocatedAmount / m.targetAmount) * 100));

            return (
              <div
                key={m.id}
                className={`snap-start min-w-[280px] sm:min-w-[310px] bg-surface-container-lowest p-space-md rounded-3xl shadow-sm hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between border ${
                  isAlert
                    ? 'ring-2 ring-error/20 border-error/30'
                    : isNorthStar
                    ? 'bg-gradient-to-br from-surface-container-lowest to-primary-fixed/20 border-primary/30'
                    : 'border-outline-variant/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span
                      className={`font-headline-md text-headline-md font-bold ${
                        isAlert ? 'text-error' : isNorthStar ? 'text-primary-container' : 'text-primary'
                      }`}
                    >
                      {m.year}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        isAlert
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : isNorthStar
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isAlert ? 'error' : isNorthStar ? 'stars' : 'check_circle'}
                      </span>
                      {isAlert ? `Gap Alert: -${formatCurrency(m.deficitAmount || 24500, currency, isPrivate, true)}` : isNorthStar ? 'North Star' : 'On Track'}
                    </span>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-space-xs ${
                      isAlert
                        ? 'bg-error-container text-error'
                        : isNorthStar
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {m.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{m.note}</p>
                </div>

                <div
                  className={`mt-space-md pt-space-sm p-space-sm rounded-2xl ${
                    isAlert ? 'bg-error-container/20' : 'bg-surface-container-low'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {isAlert ? 'Projected vs Target' : 'Allocated'}
                    </span>
                    <span
                      className={`font-headline-sm text-sm font-bold ${
                        isAlert ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {formatCurrency(m.allocatedAmount, currency, isPrivate)}{' '}
                      <span className="font-label-sm text-xs font-normal text-on-surface-variant">
                        / {formatCurrency(m.targetAmount, currency, isPrivate, true)}
                      </span>
                    </span>
                  </div>

                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAlert ? 'bg-error' : isNorthStar ? 'bg-primary-container' : 'bg-secondary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span
                    className={`font-label-sm text-label-sm font-semibold mt-1 inline-block ${
                      isAlert ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {isAlert
                      ? `${pct}% projected • Shortage: ${formatCurrency(m.deficitAmount || 24500, currency, isPrivate)}`
                      : `${pct}% funded • Age ${m.age}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Gap Analysis & AI Optimization Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left: Deficit Breakdown Card (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md border border-outline-variant/30">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-9 h-9 rounded-2xl bg-error-container text-error flex items-center justify-center">
                  <span className="material-symbols-outlined">troubleshoot</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-error uppercase font-bold tracking-wider">
                    Gap Diagnostics
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    2031 Home Down Payment Shortage
                  </h3>
                </div>
              </div>
              <span className="font-currency-stat text-2xl text-error font-extrabold leading-none">
                -{formatCurrency(currentGap, currency, isPrivate)}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
              At your current monthly velocity of{' '}
              <strong className="text-on-surface font-semibold">
                {formatCurrency(savings, currency, isPrivate)}/mo
              </strong>
              , you will reach{' '}
              <strong className="text-on-surface font-semibold">
                {formatCurrency(125500, currency, isPrivate)}
              </strong>{' '}
              by July 2031 against your desired purchase target of{' '}
              <strong className="text-on-surface font-semibold">
                {formatCurrency(150000, currency, isPrivate)}
              </strong>
              .
            </p>
          </div>

          {/* Solutions Bento Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* Option A */}
            <div
              className={`p-space-md rounded-2xl flex flex-col justify-between transition-all border ${
                optionApplied === 'A'
                  ? 'bg-secondary-container/30 border-secondary'
                  : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
              }`}
            >
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold">
                    Option A • Recommended
                  </span>
                  <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Boost Monthly Savings
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Increase monthly deposits by <strong>+$210/mo</strong> starting next month. Keeps
                  your target completion in Q2 2031.
                </p>
              </div>
              <button
                onClick={handleApplyOptionA}
                disabled={optionApplied === 'A'}
                className={`mt-space-md w-full py-2.5 px-space-md rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1 shadow-sm font-bold ${
                  optionApplied === 'A'
                    ? 'bg-secondary text-white'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                <span>{optionApplied === 'A' ? 'Applied to Roadmap' : 'Apply to Roadmap'}</span>
                <span className="material-symbols-outlined text-sm">
                  {optionApplied === 'A' ? 'check' : 'arrow_forward'}
                </span>
              </button>
            </div>

            {/* Option B */}
            <div
              className={`p-space-md rounded-2xl flex flex-col justify-between transition-all border ${
                optionApplied === 'B'
                  ? 'bg-secondary-container/30 border-secondary'
                  : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
              }`}
            >
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                    Option B • Timeline Flex
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">
                    update
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Extend Horizon by 8 Mos
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Shift purchase target date to <strong>March 2032</strong> without increasing
                  monthly contribution strain.
                </p>
              </div>
              <button
                onClick={handleApplyOptionB}
                disabled={optionApplied === 'B'}
                className={`mt-space-md w-full py-2.5 px-space-md rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1 shadow-sm font-bold ${
                  optionApplied === 'B'
                    ? 'bg-secondary text-white'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>{optionApplied === 'B' ? 'Timeline Shifted' : 'Simulate Extension'}</span>
                <span className="material-symbols-outlined text-sm">
                  {optionApplied === 'B' ? 'check' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Monte Carlo Confidence Box (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md border border-outline-variant/30">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
                Lumo AI Copilot Recommendation
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">
              Preserve Liquidity While Closing Gap
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              Because your Checking buffer currently holds{' '}
              <strong className="text-on-surface">$3,140 in idle yield</strong>, implementing{' '}
              <strong>Option A (+$210/mo)</strong> will not restrict your daily lifestyle. It protects
              compounding runway for your 2052 Financial Independence target.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-lowest rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Monte Carlo Success Rate:</span>
              <span className="font-bold text-secondary">{feasibility}%</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${feasibility}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>Worst Case: $2.1M</span>
              <span>Median: $2.85M</span>
              <span>Best Case: $3.9M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
