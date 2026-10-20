import React, { useEffect, useState } from 'react';
import { X, Sparkles, Bot, ShieldCheck, Check, Share2, ArrowRight } from 'lucide-react';
import { Holding, Currency, RiskMetrics } from '../types/finance';
import { runPortfolioAudit } from '../services/geminiService';

interface PortfolioAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdings: Holding[];
  totalValue: number;
  currency: Currency;
  onAskCopilot: (prompt: string) => void;
}

export const PortfolioAuditModal: React.FC<PortfolioAuditModalProps> = ({
  isOpen,
  onClose,
  holdings,
  totalValue,
  currency,
  onAskCopilot,
}) => {
  const [auditText, setAuditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const metrics: RiskMetrics = {
    riskScore: 68,
    riskLevel: 'Moderate-Aggressive',
    sharpeRatio: 1.72,
    portfolioBeta: 1.14,
    maxDrawdown: -14.2,
    volatility: 12.8,
    diversificationScore: 84,
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setAuditText('');
      runPortfolioAudit(holdings, totalValue, metrics)
        .then((res) => {
          setAuditText(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, holdings, totalValue]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(auditText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedMarkdown = (text: string) => {
    return (
      <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
        {text.split('\n').map((line, i) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={i} className="text-base font-bold text-cyan-300 mt-5 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
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
            return <hr key={i} className="border-white/10 my-4" />;
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={i} className="flex items-start gap-2 ml-2 my-1">
                <span className="text-amber-400 font-mono font-semibold shrink-0">
                  {line.match(/^\d+\./)?.[0]}
                </span>
                <div>{renderInline(line.replace(/^\d+\.\s+/, ''))}</div>
              </div>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-2 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <div>{renderInline(line.replace(/^[-*]\s+/, ''))}</div>
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
      <div className="relative w-full max-w-3xl bg-[#0B0F17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[88vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Institutional Portfolio Audit</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Score: 88/100
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive factor sensitivity, concentration risk & rebalancing roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              title="Copy Audit"
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
            <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
                <div className="w-14 h-14 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Running Comprehensive Portfolio Diagnostics</p>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing factor betas, sector weightings & yield sustainability...</p>
              </div>
            </div>
          ) : (
            renderFormattedMarkdown(auditText)
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <span className="text-[10px] text-slate-500">
            Powered by Google Gemini 3.8 Flash • Fiduciary AI Engine
          </span>
          <button
            onClick={() => {
              onClose();
              onAskCopilot("Help me implement the tactical rebalancing action plan from the portfolio audit step by step.");
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Execute Rebalancing Plan with FinAI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
