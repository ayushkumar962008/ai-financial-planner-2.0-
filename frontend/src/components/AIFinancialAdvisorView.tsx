import React, { useState, useRef, useEffect } from 'react';
import { AdvisorChatMessage } from '../types/lifepath';
import { INITIAL_ADVISOR_MESSAGES } from '../data/lifepathData';
import { Currency } from '../utils/lifepathFormatters';
import {
  askAdvisor,
  fetchChatHistory,
  fetchHealth,
  saveGeminiKey,
  HealthResponse,
} from '../services/api';

interface AIFinancialAdvisorViewProps {
  initialPrompt?: string;
  currency: Currency;
  isPrivate: boolean;
  onNavigateTab: (tab: any, prompt?: string) => void;
}

export const AIFinancialAdvisorView: React.FC<AIFinancialAdvisorViewProps> = ({
  initialPrompt,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<AdvisorChatMessage[]>(INITIAL_ADVISOR_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'How do I fix the 2031 Home Down Payment deficit?',
    'What happens if I automate my $3,140 idle checking?',
    'Stress-test my portfolio against 6% inflation',
    'Compare retiring at Age 53 vs Age 58',
    'Am I saving enough for the Tokyo sabbatical?',
  ];

  // Load backend status and chat history on mount
  useEffect(() => {
    fetchHealth()
      .then((h) => setHealth(h))
      .catch((e) => console.warn('Could not check health:', e));

    fetchChatHistory()
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(history);
        }
      })
      .catch((e) => console.warn('Could not fetch chat history:', e));
  }, []);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isTyping) return;

    const userMsg: AdvisorChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      // Call backend REST endpoint
      const response = await askAdvisor(query);

      const aiMsg: AdvisorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tags: response.tags,
        metrics: response.metrics,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Advisor request error:', err);
      // Fallback message
      const errorMsg: AdvisorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I encountered an unexpected connection latency while communicating with the engine. Your local portfolio ($142,850 net worth, $3,550/mo savings) remains fully safeguarded. Please retry or check API status.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tags: ['Network Fallback', 'Safe Mode'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveKey = async () => {
    setIsSavingKey(true);
    setKeyFeedback(null);
    try {
      const res = await saveGeminiKey(apiKeyInput);
      setKeyFeedback({ type: 'success', text: res.message });
      const h = await fetchHealth();
      setHealth(h);
      setTimeout(() => {
        setIsKeyModalOpen(false);
        setKeyFeedback(null);
      }, 1500);
    } catch (err: any) {
      setKeyFeedback({
        type: 'error',
        text: err?.message || 'Failed to save Gemini API Key.',
      });
    } finally {
      setIsSavingKey(false);
    }
  };

  // Helper to strip markdown asterisks and parse into clean typography
  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-on-surface">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Remove any remaining stray asterisks
      const cleaned = part.replace(/\*/g, '');
      return <span key={i}>{cleaned}</span>;
    });
  };

  const renderCleanContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return (
      <div className="flex flex-col gap-1 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-0.5" />;

          // Header lines (### or ##)
          if (trimmed.startsWith('#')) {
            const headerText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            return (
              <div
                key={idx}
                className="font-bold text-primary dark:text-primary-fixed text-sm mt-1 mb-0.5 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-3 bg-primary rounded-full shrink-0" />
                <span>{headerText}</span>
              </div>
            );
          }

          // Numbered item (e.g. 1. 2.)
          const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary dark:text-primary-fixed font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {numMatch[1]}
                </span>
                <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
              </div>
            );
          }

          // Bullet item (•, -, *)
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const itemText = trimmed.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                <div className="flex-1">{parseInlineFormatting(itemText)}</div>
              </div>
            );
          }

          // Regular paragraph line
          return (
            <p key={idx} className="my-0.5">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto pb-16 flex flex-col gap-space-md">
      {/* Top Banner & Live Status */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                Lumo AI Financial Copilot
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1 ${
                  health?.geminiConfigured
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-primary-fixed/40 text-primary'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.geminiConfigured ? 'bg-secondary animate-pulse' : 'bg-primary'
                  }`}
                />
                {health?.geminiConfigured ? 'Gemini 3.8 Flash Active' : 'Quantitative Fiduciary Ready'}
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Grounded in Maya’s real-time $142,850 portfolio, $3,550/mo cashflow, and Monte Carlo telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30"
            title="Configure Gemini API Key"
          >
            <span className="material-symbols-outlined text-sm text-primary">key</span>
            <span>{health?.geminiConfigured ? 'Gemini Key: Active' : 'Set Gemini Key'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('simulator')}
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Simulator</span>
          </button>
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">timeline</span>
            <span>Roadmap</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs text-on-surface-variant font-semibold shrink-0">Try asking:</span>
        {suggestedQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-xs text-on-surface font-medium whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30 min-h-[460px] max-h-[620px] overflow-y-auto flex flex-col gap-space-md">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${
                  isUser
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-primary-container text-on-primary shadow-sm'
                }`}
              >
                {isUser ? (
                  <span className="material-symbols-outlined text-base">person</span>
                ) : (
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                )}
              </div>

              <div
                className={`flex flex-col gap-1 p-space-md rounded-2xl shadow-xs text-sm ${
                  isUser
                    ? 'bg-primary text-on-primary rounded-tr-none'
                    : 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[11px] opacity-75">
                  <span className="font-bold">{isUser ? 'Maya (User)' : 'Lumo AI Advisor'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="font-body-sm text-sm">
                  {renderCleanContent(msg.text)}
                </div>

                {/* Metrics Cards if present */}
                {msg.metrics && (
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-outline-variant/20">
                    {msg.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="p-2 rounded-xl bg-surface-container-lowest flex flex-col"
                      >
                        <span className="text-[10px] text-on-surface-variant font-semibold">
                          {m.label}
                        </span>
                        <span className="text-sm font-bold text-secondary">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {msg.tags && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {msg.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant p-2 animate-pulse">
            <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
            <span>Lumo is computing fiduciary recommendations with Gemini 3.8 Flash...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="bg-surface-container-lowest rounded-2xl p-2 shadow-sm border border-outline-variant/30 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask Lumo anything about Maya’s roadmap, cashflow, down payment, or retirement..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          className="h-10 px-5 rounded-full bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 transition-colors font-headline-sm text-xs font-bold flex items-center gap-1 shadow-sm"
        >
          <span>Send</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>

      {/* Gemini API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">key</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    Gemini API Setup
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Powered by Google Gemini 3.8 Flash
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="py-4 flex flex-col gap-3">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connect your Google Gemini API key to enable live reasoning using the official{' '}
                <code className="text-primary font-mono text-[11px]">@google/genai</code> SDK and{' '}
                <code className="text-primary font-mono text-[11px]">gemini-3.8-flash</code>.
              </p>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Current Status:</span>
                <span
                  className={`font-semibold ${
                    health?.geminiConfigured ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {health?.geminiConfigured
                    ? 'Connected (gemini-3.8-flash)'
                    : 'Using Built-in Quantitative Engine'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
                />
                <span className="text-[11px] text-on-surface-variant mt-1 block">
                  Keys are stored in your project's local <code className="font-mono">.env</code> and memory.
                </span>
              </div>

              {keyFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    keyFeedback.type === 'success'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {keyFeedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{keyFeedback.text}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveKey}
                disabled={isSavingKey}
                className="px-5 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                {isSavingKey ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save & Activate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
