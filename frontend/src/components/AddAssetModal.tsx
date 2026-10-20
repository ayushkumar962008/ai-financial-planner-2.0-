import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Holding, AssetCategory, Currency } from '../types/finance';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (holding: Holding) => void;
  currency: Currency;
}

const PRESET_ASSETS: Partial<Holding>[] = [
  { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 188.40, category: 'Equities', sector: 'E-Commerce & Cloud', dividendYield: 0.0 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', currentPrice: 218.80, category: 'Equities', sector: 'EV & Clean Energy', dividendYield: 0.0 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', currentPrice: 162.20, category: 'Equities', sector: 'Defensive Healthcare', dividendYield: 3.10 },
  { symbol: 'ETH', name: 'Ethereum Spot', currentPrice: 2640.00, category: 'Crypto', sector: 'Smart Contract Network', dividendYield: 0.0 },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', currentPrice: 92.50, category: 'Fixed Income', sector: 'Long-Duration Government Bonds', dividendYield: 3.90 },
];

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onAddHolding,
  currency,
}) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Equities');
  const [sector, setSector] = useState('Technology & Growth');
  const [dividendYield, setDividendYield] = useState('0.0');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: Partial<Holding>) => {
    if (preset.symbol) setSymbol(preset.symbol);
    if (preset.name) setName(preset.name);
    if (preset.currentPrice) {
      setCurrentPrice(preset.currentPrice.toString());
      setAvgBuyPrice(preset.currentPrice.toString());
    }
    if (preset.category) setCategory(preset.category);
    if (preset.sector) setSector(preset.sector);
    if (preset.dividendYield !== undefined) setDividendYield(preset.dividendYield.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares || !currentPrice) return;

    const sharesNum = parseFloat(shares);
    const curPriceNum = parseFloat(currentPrice);
    const buyPriceNum = avgBuyPrice ? parseFloat(avgBuyPrice) : curPriceNum;
    const divNum = dividendYield ? parseFloat(dividendYield) : 0;

    const newHolding: Holding = {
      id: `holding-${Date.now()}`,
      symbol: symbol.toUpperCase().trim(),
      name: name.trim() || symbol.toUpperCase().trim(),
      shares: sharesNum,
      avgBuyPrice: buyPriceNum,
      currentPrice: curPriceNum,
      change24h: 0.0,
      changePercent24h: 0.0,
      category,
      sector: sector.trim() || 'General Assets',
      dividendYield: divNum,
    };

    onAddHolding(newHolding);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0F17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Holding</h3>
              <p className="text-xs text-slate-400">Expand your portfolio intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_ASSETS.map((p) => (
              <button
                key={p.symbol}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-all hover:border-cyan-400"
              >
                +{p.symbol} (${p.currentPrice})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ticker / Symbol *</label>
              <input
                type="text"
                required
                placeholder="e.g. MSFT"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company / Asset Name</label>
              <input
                type="text"
                placeholder="e.g. Microsoft Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Shares / Units *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 25"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Price ($) *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 420.50"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Average Buy Price ($)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 380.00"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Annual Div Yield (%)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 2.5"
                value={dividendYield}
                onChange={(e) => setDividendYield(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Asset Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Equities">Equities</option>
                <option value="Fixed Income">Fixed Income</option>
                <option value="Crypto">Crypto</option>
                <option value="Cash & Equivalents">Cash & Equivalents</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Commodities">Commodities</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Sector / Sub-industry</label>
              <input
                type="text"
                placeholder="e.g. Cloud Computing"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
            >
              Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
