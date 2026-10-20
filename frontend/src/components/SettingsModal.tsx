import React, { useState } from 'react';
import { X, Key, Check, Eye, EyeOff, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { Currency } from '../types/finance';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  getSelectedModel, 
  setSelectedModel 
} from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onSelectCurrency: (c: Currency) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectCurrency,
  onResetData,
}) => {
  const [apiKey, setApiKey] = useState<string>(() => getGeminiApiKey());
  const [model, setModel] = useState<string>(() => getSelectedModel());
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(apiKey.trim());
    setSelectedModel(model);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClearKey = () => {
    setApiKey('');
    setGeminiApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0F17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Settings & AI Engine</h3>
              <p className="text-xs text-slate-400">Configure Gemini API key, model and preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Gemini API Key Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                <span>Get a free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.1] rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="text-[10px] text-rose-400 hover:underline px-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your API key is saved locally in your browser’s <code className="text-cyan-300 font-mono">localStorage</code>. When left empty, ApexWealth AI runs seamlessly in <strong>Autonomous Demo Simulation Mode</strong> with realistic quantitative analysis.
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">AI Model Selection</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('gemini-3.8-flash')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  model === 'gemini-3.8-flash'
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm'
                    : 'bg-slate-900/60 border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Gemini 3.8 Flash</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">Recommended</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  1M context window • Best balance of speed & analytical depth
                </div>
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-3.5-flash-lite')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  model === 'gemini-3.5-flash-lite'
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm'
                    : 'bg-slate-900/60 border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Gemini 3.5 Flash-Lite</span>
                  <span className="text-[9px] bg-white/[0.05] text-slate-300 px-1.5 py-0.5 rounded font-mono">Ultra-Fast</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Lowest latency for high-frequency queries
                </div>
              </button>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Base Currency Display</label>
            <div className="grid grid-cols-5 gap-2">
              {(['USD', 'EUR', 'GBP', 'INR', 'JPY'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => onSelectCurrency(cur)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    currency === cur
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">Reset Sample Portfolio</div>
              <div className="text-[11px] text-slate-400">Restore default demo positions and watchlists</div>
            </div>
            <button
              type="button"
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Apply</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
