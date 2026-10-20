import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Trash2, 
  Search, 
  Bot, 
  Plus,
  BarChart3
} from 'lucide-react';
import { Holding, Currency, AssetCategory } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { TIMEFRAME_PERFORMANCE } from '../data/mockFinancialData';

interface PortfolioOverviewProps {
  holdings: Holding[];
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  currency: Currency;
  onDeleteHolding: (id: string) => void;
  onOpenAddAsset: () => void;
  onInspectAsset: (holding: Holding) => void;
  onOpenAudit: () => void;
}

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  'Equities': '#00F2FE',
  'Fixed Income': '#10B981',
  'Crypto': '#8B5CF6',
  'Cash & Equivalents': '#3B82F6',
  'Real Estate': '#F59E0B',
  'Commodities': '#EC4899',
};

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  holdings,
  totalValue,
  totalGain,
  totalGainPercent,
  totalChange24h,
  totalChangePercent24h,
  currency,
  onDeleteHolding,
  onOpenAddAsset,
  onInspectAsset,
  onOpenAudit,
}) => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute category allocation data
  const categoryAllocation = holdings.reduce((acc, h) => {
    const val = h.shares * h.currentPrice;
    acc[h.category] = (acc[h.category] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryAllocation).map(([name, value]) => ({
    name,
    value,
    percent: (value / totalValue) * 100,
  })).sort((a, b) => b.value - a.value);

  // Compute annual projected dividend
  const annualDividendTotal = holdings.reduce((sum, h) => {
    const val = h.shares * h.currentPrice;
    return sum + (val * (h.dividendYield / 100));
  }, 0);
  const blendedYield = totalValue > 0 ? (annualDividendTotal / totalValue) * 100 : 0;

  // Filtered holdings
  const filteredHoldings = holdings.filter(h => {
    const matchesSearch = h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (b.shares * b.currentPrice) - (a.shares * a.currentPrice));

  const performanceData = TIMEFRAME_PERFORMANCE[timeframe] || TIMEFRAME_PERFORMANCE['1M'];

  return (
    <div className="space-y-6">
      
      {/* 4 Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Value Card */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Net Worth</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300">Live</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(totalValue, currency)}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center font-semibold font-mono ${totalChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalChange24h >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
              {formatPercent(totalChangePercent24h)}
            </span>
            <span className="text-slate-500">24h Change ({formatCurrency(totalChange24h, currency)})</span>
          </div>
        </div>

        {/* Total Unrealized Gain Card */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Profit / Alpha</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">All-Time</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
            +{formatCurrency(totalGain, currency)}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-semibold font-mono text-emerald-400">
              +{formatPercent(totalGainPercent, false)}
            </span>
            <span className="text-slate-500">Return on invested capital</span>
          </div>
        </div>

        {/* Annual Dividend Yield Card */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 hover:border-amber-500/30 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Passive Cash Flow</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tracking-tight">
            {formatCurrency(annualDividendTotal, currency)}
            <span className="text-xs font-sans text-slate-400 font-normal ml-1">/yr</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-semibold font-mono text-amber-400">{blendedYield.toFixed(2)}%</span>
            <span className="text-slate-500">Blended yield (~{formatCurrency(annualDividendTotal / 12, currency)}/mo)</span>
          </div>
        </div>

        {/* AI Health Score Card */}
        <div className="relative overflow-hidden bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 hover:border-purple-500/30 transition-all group cursor-pointer" onClick={onOpenAudit}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Portfolio Health Score</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              88<span className="text-sm text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
              Institutional
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400 hover:underline">
              <Sparkles className="w-3 h-3" /> View AI Diagnosis
            </span>
            <span className="text-slate-500">Sharpe: 1.72</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Performance Chart + Asset Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Historical Performance Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Performance Trajectory & Alpha
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Realized growth vs S&P 500 benchmark
                </p>
              </div>

              {/* Controls: Timeframe & Benchmark */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBenchmark(!showBenchmark)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    showBenchmark 
                      ? 'bg-slate-800 text-slate-200 border-white/20' 
                      : 'text-slate-500 border-white/5 hover:text-slate-300'
                  }`}
                >
                  S&P 500 {showBenchmark ? '●' : '○'}
                </button>
                <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/[0.08]">
                  {(['1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        timeframe === tf 
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High/Low stat callouts */}
            <div className="flex items-center gap-6 py-2 mb-2 border-b border-white/[0.04] text-xs font-mono">
              <div>
                <span className="text-slate-500">Period Return: </span>
                <span className="text-emerald-400 font-semibold">+4.91%</span>
              </div>
              <div>
                <span className="text-slate-500">Alpha over S&P: </span>
                <span className="text-cyan-400 font-semibold">+1.85%</span>
              </div>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
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
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B0F17', 
                    borderColor: 'rgba(255,255,255,0.12)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' 
                  }}
                  formatter={(val: unknown) => [typeof val === 'number' ? formatCurrency(val, currency) : '', '']}
                  labelStyle={{ color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="My Portfolio" 
                  stroke="#00F2FE" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#portfolioGradient)" 
                />
                {showBenchmark && (
                  <Area 
                    type="monotone" 
                    dataKey="sp500" 
                    name="S&P 500" 
                    stroke="#94A3B8" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.5} 
                    fillOpacity={1} 
                    fill="url(#sp500Gradient)" 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation Donut Chart (1 Col) */}
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Asset Allocation
              </h3>
              <span className="text-xs text-slate-400">By Value</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Current diversification across 6 asset classes
            </p>

            {/* Donut Chart */}
            <div className="h-[180px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell 
                        key={entry.name} 
                        fill={CATEGORY_COLORS[entry.name as AssetCategory] || '#06B6D4'} 
                        stroke="#080C14"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B0F17', 
                      borderColor: 'rgba(255,255,255,0.12)', 
                      borderRadius: '12px' 
                    }}
                    formatter={(val: unknown) => [typeof val === 'number' ? formatCurrency(val, currency) : '', 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Equities</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {pieData.find(p => p.name === 'Equities')?.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Allocation Legend List */}
          <div className="mt-4 space-y-2 border-t border-white/[0.04] pt-3">
            {pieData.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: CATEGORY_COLORS[item.name as AssetCategory] || '#06B6D4' }} 
                  />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">{formatCurrency(item.value, currency, true)}</span>
                  <span className="text-white font-bold w-12 text-right">{item.percent.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6">
        
        {/* Table Header & Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white">Active Portfolio Holdings</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-300">
                {holdings.length} Assets
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time prices, unrealized profit & AI research triggers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol, company or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/80 border border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all w-52 sm:w-64"
              />
            </div>

            {/* Category Filter Pills */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950/80 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Categories</option>
              <option value="Equities">Equities</option>
              <option value="Fixed Income">Fixed Income</option>
              <option value="Crypto">Crypto</option>
              <option value="Cash & Equivalents">Cash</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Commodities">Commodities</option>
            </select>

            <button
              onClick={onOpenAddAsset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Asset / Sector</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Market Price</th>
                <th className="py-3 px-4 text-right">Holdings</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-right">Total Profit / Loss</th>
                <th className="py-3 px-4 text-right">Div Yield</th>
                <th className="py-3 px-4 text-center">AI Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredHoldings.map((h) => {
                const totalHoldingVal = h.shares * h.currentPrice;
                const gainDollar = h.shares * (h.currentPrice - h.avgBuyPrice);
                const gainPct = ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                const isGain = gainDollar >= 0;
                const is24hGain = h.change24h >= 0;

                return (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Symbol & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/[0.08] flex items-center justify-center font-bold font-mono text-cyan-400 text-xs">
                          {h.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {h.symbol}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {h.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[h.category] || '#06B6D4'}15`,
                          color: CATEGORY_COLORS[h.category] || '#06B6D4',
                          borderColor: `${CATEGORY_COLORS[h.category] || '#06B6D4'}30`,
                        }}
                      >
                        {h.category}
                      </span>
                    </td>

                    {/* Current Price & 24h Change */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-white font-semibold">
                        {formatCurrency(h.currentPrice, currency)}
                      </div>
                      <div className={`text-[10px] flex items-center justify-end gap-0.5 ${is24hGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {is24hGain ? '+' : ''}{h.changePercent24h.toFixed(2)}%
                      </div>
                    </td>

                    {/* Shares & Avg Buy */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-white font-medium">
                        {h.shares.toLocaleString()} sh
                      </div>
                      <div className="text-[10px] text-slate-500">
                        avg @ {formatCurrency(h.avgBuyPrice, currency)}
                      </div>
                    </td>

                    {/* Total Value */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-white font-bold">
                        {formatCurrency(totalHoldingVal, currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {((totalHoldingVal / totalValue) * 100).toFixed(1)}% of total
                      </div>
                    </td>

                    {/* Total Return */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className={`font-semibold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGain ? '+' : ''}{formatCurrency(gainDollar, currency)}
                      </div>
                      <div className={`text-[10px] ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGain ? '+' : ''}{gainPct.toFixed(2)}%
                      </div>
                    </td>

                    {/* Dividend Yield */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {h.dividendYield > 0 ? (
                        <span className="text-amber-400 font-medium">
                          {h.dividendYield.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Actions: AI Inspect & Delete */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onInspectAsset(h)}
                          title="Ask AI to analyze this asset"
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all hover:scale-105"
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteHolding(h.id)}
                          title="Remove holding"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHoldings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No holdings match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
