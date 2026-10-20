import React, { useEffect, useState } from 'react';
import { X, Sparkles, Bot, ArrowRight, Share2, Check } from 'lucide-react';
import { WatchlistStock, Currency } from '../types/finance';
import { runStockDeepDive } from '../services/geminiService';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface StockDeepDiveModalProps {
  stock: WatchlistStock | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onAskCopilot: (prompt: string) => void;
}

export const StockDeepDiveModal: React.FC<StockDeepDiveModalProps> = ({
  stock,
  isOpen,
  onClose,
  currency,
  onAskCopilot,
}) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && stock) {
      setLoading(true);
      setReport('');
      runStockDeepDive(stock)
        .then((res) => {
          setReport(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, stock]);

  if (!isOpen || !stock) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedMarkdown = (text: string) => {
    return (
      <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
        {text.split('\n').map((line, i) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={i} className="text-base font-bold text-cyan-300 mt-4 mb-1">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={i} className="text-sm font-semibold text-white mt-3 mb-1">
                {line.replace('#### ', '')}
              </h4>
            );
          }
          if (line.startsWith('---')) {
            return <hr key={i} className="border-white/10 my-3" />;
          }
          if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-1">
                <span className="text-cyan-400 font-mono font-bold shrink-0">{line.slice(0, 3)}</span>
                <div>{renderInline(line.slice(3))}</div>
              </div>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <div>{renderInline(line.slice(2))}</div>
              </div>
            );
          }
          if (!line.trim()) return <div key={i} className="h-1"></div>;
          return <p key={i}>{renderInline(line)}</p>;
        })}
      </div>
    );
  };

  const renderInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B0F17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold font-mono text-cyan-400">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{stock.symbol}</h2>
                <span className="text-xs text-slate-400">{stock.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 font-medium">
                  {stock.sector}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs mt-0.5 font-mono">
                <span className="text-white font-bold">{formatCurrency(stock.price, currency)}</span>
                <span className={`font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercent(stock.changePercent)}
                </span>
                <span className="text-slate-500">P/E: {stock.peRatio}x</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              title="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
                <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Synthesizing Institutional Equity Research</p>
                <p className="text-xs text-slate-400 mt-1">Analyzing valuation multiples, moat catalysts & sentiment vectors...</p>
              </div>
            </div>
          ) : (
            renderFormattedMarkdown(report)
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <span className="text-[10px] text-slate-500">
            Powered by Google Gemini 3.8 Flash • Research model output
          </span>
          <button
            onClick={() => {
              onClose();
              onAskCopilot(`Provide a detailed tactical valuation assessment of ${stock.symbol} including key support levels.`);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask FinAI Follow-Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
