import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Search, 
  Bot, 
  Activity, 
  Globe, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { WatchlistStock, Currency } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface StockWatchlistProps {
  watchlist: WatchlistStock[];
  currency: Currency;
  onSelectStock: (stock: WatchlistStock) => void;
}

export const StockWatchlist: React.FC<StockWatchlistProps> = ({
  watchlist,
  currency,
  onSelectStock,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sentiment' | 'change' | 'pe'>('sentiment');

  // Market indices ticker data
  const indices = [
    { name: 'S&P 500', value: '5,864.67', change: '+0.64%', isUp: true },
    { name: 'NASDAQ 100', value: '20,382.40', change: '+1.18%', isUp: true },
    { name: 'DOW JONES', value: '43,239.05', change: '+0.09%', isUp: true },
    { name: 'US 10Y YIELD', value: '4.084%', change: '-0.034', isUp: false },
    { name: 'BITCOIN', value: '$68,240', change: '+2.45%', isUp: true },
    { name: 'GOLD SPOT', value: '$2,721.40', change: '+0.78%', isUp: true },
    { name: 'BRENT CRUDE', value: '$74.15', change: '-1.20%', isUp: false },
  ];

  const filteredList = watchlist.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' 
      ? true 
      : filterCategory === 'Bullish' 
        ? stock.sentiment === 'Bullish' 
        : stock.sector.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'sentiment') return b.sentimentScore - a.sentimentScore;
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    if (sortBy === 'pe') return a.peRatio - b.peRatio;
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Live Market Indices Ticker Marquee Bar */}
      <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-3 overflow-hidden shadow-inner">
        <div className="flex items-center gap-2 mb-1 px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Global Macro Pulse & Benchmark Indices</span>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto py-1 px-2 no-scrollbar">
          {indices.map((idx) => (
            <div key={idx.name} className="flex items-center gap-2.5 whitespace-nowrap bg-slate-950/60 border border-white/[0.05] px-3 py-1.5 rounded-xl text-xs">
              <span className="font-bold text-slate-300">{idx.name}</span>
              <span className="font-mono text-white font-medium">{idx.value}</span>
              <span className={`flex items-center font-mono font-bold text-[11px] ${idx.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {idx.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist Controls Header */}
      <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">AI Stock & Market Watchlist</h2>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Zap className="w-3 h-3" /> Real-time Sentiment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Institutional factor analysis, 52-week valuations, and AI bullish/bearish catalysts
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticker, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/80 border border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950/80 border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="sentiment">Sort: AI Sentiment Score</option>
                <option value="change">Sort: 24h Price Change</option>
                <option value="pe">Sort: Valuation (P/E)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/[0.04]">
          {['All', 'Bullish', 'Semiconductors', 'Cloud', 'Healthcare', 'Real Estate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 bg-slate-950/40 hover:text-white border border-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Watchlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {filteredList.map((stock) => {
            const isUp = stock.change >= 0;
            // 52-week position percentage (0 to 100)
            const range52wPercent = Math.min(
              100, 
              Math.max(0, ((stock.price - stock.low52W) / (stock.high52W - stock.low52W)) * 100)
            );

            return (
              <div 
                key={stock.symbol}
                className="bg-slate-950/60 border border-white/[0.07] hover:border-cyan-500/40 rounded-2xl p-5 transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div>
                  {/* Top Header: Symbol, Price, Sentiment Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white font-mono group-hover:text-cyan-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 font-medium">
                          {stock.sector}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold font-mono text-white text-base">
                        {formatCurrency(stock.price, currency)}
                      </div>
                      <div className={`text-[11px] font-mono font-bold flex items-center justify-end ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {formatPercent(stock.changePercent)}
                      </div>
                    </div>
                  </div>

                  {/* AI Sentiment Score Bar */}
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-white/[0.04] mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        AI Sentiment
                      </span>
                      <span className={`font-semibold font-mono ${
                        stock.sentiment === 'Bullish' ? 'text-emerald-400' : stock.sentiment === 'Neutral' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {stock.sentiment} ({stock.sentimentScore}/100)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          stock.sentiment === 'Bullish' ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${stock.sentimentScore}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Qualitative Summary */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-4 bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.03]">
                    "{stock.aiSummary}"
                  </p>

                  {/* 52-Week Range Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                      <span>52W L: ${stock.low52W}</span>
                      <span>52W H: ${stock.high52W}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 relative">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-md shadow-cyan-400/50" 
                        style={{ left: `calc(${range52wPercent}% - 5px)` }}
                      />
                    </div>
                  </div>

                  {/* Key Financial Ratios */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/[0.04] text-center text-[10px] font-mono text-slate-400">
                    <div>
                      <div className="text-slate-500">Mkt Cap</div>
                      <div className="text-slate-200 font-semibold">{stock.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">P/E Ratio</div>
                      <div className="text-slate-200 font-semibold">{stock.peRatio}x</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Beta</div>
                      <div className="text-slate-200 font-semibold">{stock.beta}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Run AI Deep Dive */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => onSelectStock(stock)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 hover:border-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm group-hover:scale-[1.01]"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate AI Deep Dive Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
