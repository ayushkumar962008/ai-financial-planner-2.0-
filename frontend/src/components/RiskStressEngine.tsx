import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  TrendingDown, 
  ArrowRight, 
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { Holding, Currency, RiskMetrics, StressScenario } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { STRESS_SCENARIOS } from '../data/mockFinancialData';

interface RiskStressEngineProps {
  holdings: Holding[];
  totalValue: number;
  currency: Currency;
  onOpenAudit: () => void;
  onAskAi: (prompt: string) => void;
}

export const RiskStressEngine: React.FC<RiskStressEngineProps> = ({
  holdings,
  totalValue,
  currency,
  onOpenAudit,
  onAskAi,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<StressScenario>(STRESS_SCENARIOS[0]);
  const [customMarketShift, setCustomMarketShift] = useState<number>(-10); // in percent

  const riskMetrics: RiskMetrics = {
    riskScore: 68,
    riskLevel: 'Moderate-Aggressive',
    sharpeRatio: 1.72,
    portfolioBeta: 1.14,
    maxDrawdown: -14.2,
    volatility: 12.8,
    diversificationScore: 84,
  };

  // Calculate dynamic custom market impact based on Beta
  const estimatedCustomImpactPct = customMarketShift * riskMetrics.portfolioBeta;
  const estimatedCustomImpactDollar = totalValue * (estimatedCustomImpactPct / 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Run AI Diagnostic */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Institutional Risk Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI Stress-Testing & Factor Vulnerability Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Evaluate how your portfolio will withstand extreme market drawdowns, inflation spikes, sector rotations, and interest rate volatility before they occur.
            </p>
          </div>

          <button
            onClick={onOpenAudit}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
            <span>Run Deep-Dive AI Audit</span>
          </button>
        </div>
      </div>

      {/* Quantitative Risk Metrics Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Diversification Score */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Diversification
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400">
            {riskMetrics.diversificationScore}<span className="text-xs text-slate-500">/100</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Strong Factor Spread
          </div>
        </div>

        {/* Portfolio Beta */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Portfolio Beta
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
            {riskMetrics.portfolioBeta}
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            +14% vs S&P 500
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Sharpe Ratio
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
            {riskMetrics.sharpeRatio}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Exceptional Risk-Reward
          </div>
        </div>

        {/* Max Historical Drawdown */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Max Drawdown
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-400">
            {riskMetrics.maxDrawdown}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Peak to trough
          </div>
        </div>

        {/* Annualized Volatility */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Volatility (σ)
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
            {riskMetrics.volatility}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Standard Deviation
          </div>
        </div>

        {/* Risk Profile Level */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            Risk Profile
          </div>
          <div className="text-sm sm:text-base font-extrabold text-amber-400 mt-1">
            {riskMetrics.riskLevel}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Growth Tilt
          </div>
        </div>
      </div>

      {/* Main Stress-Testing Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Selection Tabs (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pre-Configured Macro Scenarios
            </h3>
            <span className="text-xs text-slate-400">Click to evaluate</span>
          </div>

          {STRESS_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-white/[0.06] hover:bg-slate-800/50 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{scenario.name}</span>
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                    {formatPercent(scenario.estimatedImpactPercent)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  {scenario.description}
                </p>
              </div>
            );
          })}

          {/* Interactive Custom Market Shift Simulator */}
          <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Custom Market Shift Simulator
              </h4>
              <span className={`font-mono text-xs font-bold ${customMarketShift >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                S&P: {customMarketShift > 0 ? '+' : ''}{customMarketShift}%
              </span>
            </div>

            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={customMarketShift}
              onChange={(e) => setCustomMarketShift(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer mb-3"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>-30% Bear Crash</span>
              <span>0% Neutral</span>
              <span>+30% Bull Euphoria</span>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-white/[0.05] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Estimated Portfolio P&L</div>
                <div className="text-xs text-slate-500">Based on portfolio Beta (1.14x)</div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-sm font-bold ${estimatedCustomImpactDollar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {estimatedCustomImpactDollar >= 0 ? '+' : ''}{formatCurrency(estimatedCustomImpactDollar, currency)}
                </div>
                <div className={`text-[11px] ${estimatedCustomImpactPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercent(estimatedCustomImpactPct)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Scenario Deep-Dive Analysis (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Scenario Stress Simulation
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedScenario.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Estimated Portfolio Impact</div>
                <div className="text-xl font-extrabold font-mono text-rose-400">
                  {formatCurrency(totalValue * (selectedScenario.estimatedImpactPercent / 100), currency)}
                </div>
                <div className="text-xs font-mono text-rose-400">
                  ({formatPercent(selectedScenario.estimatedImpactPercent)})
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/[0.05] mb-5">
              {selectedScenario.description}
            </p>

            {/* Affected Sector Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Sector & Asset Class Impact Breakdown
              </h4>
              <div className="space-y-2">
                {selectedScenario.affectedSectors.map((sector) => {
                  const isNegative = sector.impact < 0;
                  return (
                    <div key={sector.sector} className="flex items-center justify-between text-xs bg-slate-950/40 p-2.5 rounded-xl border border-white/[0.03]">
                      <span className="text-slate-300 font-medium">{sector.sector}</span>
                      <span className={`font-mono font-bold ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatPercent(sector.impact)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Hedging Recommendation */}
            <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                FinAI Hedging Strategy & Recommendation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedScenario.aiAdvice}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => onAskAi(`How should I hedge my portfolio against ${selectedScenario.name}?`)}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask FinAI for Step-by-Step Hedge</span>
            </button>
            <span className="text-[11px] text-slate-500">
              Simulated under Monte Carlo factor models
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
