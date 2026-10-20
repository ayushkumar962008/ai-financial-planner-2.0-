import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  DollarSign, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  PiggyBank 
} from 'lucide-react';
import { Holding, Currency, DividendMonth, ExDividendDate } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { MONTHLY_DIVIDENDS, UPCOMING_EX_DATES } from '../data/mockFinancialData';

interface DividendTrackerProps {
  holdings: Holding[];
  totalValue: number;
  currency: Currency;
  onAskAi: (prompt: string) => void;
}

export const DividendTracker: React.FC<DividendTrackerProps> = ({
  holdings,
  totalValue,
  currency,
  onAskAi,
}) => {
  const [dripEnabled, setDripEnabled] = useState<boolean>(true);
  const [compoundYears, setCompoundYears] = useState<number>(5);

  // Calculate annual projected dividend
  const annualDividendTotal = holdings.reduce((sum, h) => {
    const val = h.shares * h.currentPrice;
    return sum + (val * (h.dividendYield / 100));
  }, 0);
  
  const monthlyAverage = annualDividendTotal / 12;
  const currentYield = totalValue > 0 ? (annualDividendTotal / totalValue) * 100 : 0;

  // Simple DRIP compounding calculation
  // A = P(1 + r/n)^(nt) + PMT * ...
  const dividendGrowthRate = 0.07; // 7% historical dividend growth rate
  const projectedFutureAnnual = annualDividendTotal * Math.pow(1 + (dripEnabled ? 0.09 : 0.05), compoundYears);

  return (
    <div className="space-y-6">
      
      {/* Top 4 Dividend KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Annual Total */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Annual Dividend Income</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
            {formatCurrency(annualDividendTotal, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Predictable passive cash flow across {holdings.filter(h => h.dividendYield > 0).length} income assets
          </p>
        </div>

        {/* Monthly Average */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Run-Rate</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
            {formatCurrency(monthlyAverage, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Average passive income per calendar month
          </p>
        </div>

        {/* Blended Portfolio Yield */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Blended Yield</span>
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {currentYield.toFixed(2)}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Yield on cost: <span className="text-white font-mono font-semibold">3.62%</span>
          </p>
        </div>

        {/* Dividend Safety Rating */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Dividend Safety Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            94<span className="text-sm text-slate-400 font-normal">/100</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Very Low Risk • Backed by cash-rich balance sheets
          </p>
        </div>
      </div>

      {/* Monthly Bar Chart + DRIP Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 12-Month Projected Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  12-Month Dividend Payout Schedule
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actual distributions & forward projected dividend income by month
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Received
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Projected
                </span>
              </div>
            </div>

            <div className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DIVIDENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    stroke="#475569" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B0F17', 
                      borderColor: 'rgba(255,255,255,0.12)', 
                      borderRadius: '12px' 
                    }}
                    formatter={(val: unknown) => [typeof val === 'number' ? formatCurrency(val, currency) : '', 'Payout']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {MONTHLY_DIVIDENDS.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isProjected ? '#06B6D4' : '#F59E0B'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
            <span>Peak Month: <strong>December ($960.00)</strong></span>
            <span>Quarterly Reinvestment boosts compound growth by ~2.4%</span>
          </div>
        </div>

        {/* DRIP Compounding Simulator (1 col) */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                DRIP Snowball Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Simulate compound dividend reinvestment acceleration
            </p>

            {/* DRIP Toggle */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/[0.05] mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Auto-DRIP Reinvestment</div>
                  <div className="text-[11px] text-slate-400">Reinvest 100% dividends into high-yield core</div>
                </div>
                <button
                  onClick={() => setDripEnabled(!dripEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    dripEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    dripEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Horizon Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Compounding Timeframe:</span>
                <span className="font-mono font-bold text-cyan-400">{compoundYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={compoundYears}
                onChange={(e) => setCompoundYears(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Projected Output */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-cyan-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Projected Annual Income in {compoundYears} Years
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-300 mt-1">
                {formatCurrency(projectedFutureAnnual, currency)}
                <span className="text-xs font-sans text-slate-400 font-normal">/yr</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-1">
                +{formatCurrency(projectedFutureAnnual - annualDividendTotal, currency)} increase
              </div>
            </div>
          </div>

          <button
            onClick={() => onAskAi("Analyze how I can optimize my portfolio dividend yield and DRIP strategy without increasing risk.")}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask FinAI for DRIP Optimization</span>
          </button>
        </div>
      </div>

      {/* Upcoming Ex-Dividend Dates Table */}
      <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Upcoming Ex-Dividend Dates & Calendar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Own before the ex-date to qualify for the next cash dividend distribution
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Asset / Fund</th>
                <th className="py-3 px-4">Ex-Dividend Date</th>
                <th className="py-3 px-4">Payout Date</th>
                <th className="py-3 px-4 text-right">Dividend Per Share</th>
                <th className="py-3 px-4 text-right">Estimated Cash Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {UPCOMING_EX_DATES.map((item) => (
                <tr key={item.symbol} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white font-mono">{item.symbol}</div>
                    <div className="text-[11px] text-slate-400">{item.company}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {item.exDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {item.payDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-200">
                    ${item.amountPerShare.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-amber-400">
                    +{formatCurrency(item.estPayout, currency)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
