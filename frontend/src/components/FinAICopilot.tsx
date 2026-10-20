import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  CornerDownLeft, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign,
  Key
} from 'lucide-react';
import { Holding, Currency, ChatMessage } from '../types/finance';
import { askFinAiAssistant, getGeminiApiKey } from '../services/geminiService';

interface FinAICopilotProps {
  holdings: Holding[];
  totalValue: number;
  currency: Currency;
  onOpenSettings: () => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: `### 👋 Welcome to FinAI Copilot
I am your personal quantitative investment analyst and portfolio strategist powered by **Gemini 3.8 Flash**.

I have real-time visibility into your current active holdings, asset allocations, dividend schedule, and factor risk exposures.

**Here are some things we can analyze right now:**
- **Diversification & Risk**: Check if your portfolio is over-concentrated in tech or vulnerable to rate hikes.
- **Dividend Optimization**: Strategies to raise your annual yield without taking excessive credit risk.
- **Rebalancing Guidance**: Actionable steps to optimize risk-adjusted returns (Sharpe ratio).
- **Single Stock Deep-Dives**: Ask about any asset in your portfolio or global watchlist.

What would you like to explore today?`,
    timestamp: 'Just now',
    suggestions: [
      'Audit my portfolio concentration risk',
      'How to boost my monthly dividend income?',
      'Is NVDA overvalued at current prices?',
      'How will rate cuts affect my bond & REIT holdings?'
    ]
  }
];

export const FinAICopilot: React.FC<FinAICopilotProps> = ({
  holdings,
  totalValue,
  currency,
  onOpenSettings,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('apex_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasApiKey = Boolean(getGeminiApiKey());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    try {
      localStorage.setItem('apex_chat_messages', JSON.stringify(messages));
    } catch {
      // storage limit ignore
    }
  }, [messages, isTyping]);

  // Handle external prompts sent from other tabs
  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const responseText = await askFinAiAssistant(
        textToSend,
        holdings,
        totalValue,
        messages.map(m => ({ sender: m.sender as any, text: m.text }))
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What are the best defensive hedges for this portfolio?',
          'Recommend 3 high-yield aristocrat stocks',
          'Explain my portfolio Sharpe ratio'
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ I encountered an error communicating with the intelligence service. Please check your Gemini API key in settings or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('apex_chat_messages');
  };

  // Basic markdown renderer for headers, bold, bullets
  const renderFormattedText = (content: string) => {
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-200">
        {content.split('\n').map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-white text-sm sm:text-base mt-3 mb-1 text-cyan-300">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-bold text-white text-xs sm:text-sm mt-2 mb-1 text-slate-100">
                {line.replace('#### ', '')}
              </h5>
            );
          }
          if (line.startsWith('---')) {
            return <hr key={idx} className="border-white/10 my-3" />;
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const itemText = line.replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                <span>{renderInlineStyles(itemText)}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="text-amber-400 font-mono font-semibold shrink-0">
                  {line.match(/^\d+\./)?.[0]}
                </span>
                <span>{renderInlineStyles(line.replace(/^\d+\.\s+/, ''))}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1"></div>;
          }
          return <p key={idx}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    // Replace **bold** with strong
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl h-[720px] flex flex-col overflow-hidden shadow-2xl">
      
      {/* Copilot Header */}
      <div className="p-4 border-b border-white/[0.08] bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">FinAI Intelligence Copilot</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Grounding Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time portfolio context loaded ({holdings.length} assets, ${(totalValue).toLocaleString()})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!hasApiKey && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Key className="w-3 h-3 text-amber-400" />
              <span>Connect Gemini Key</span>
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                isUser 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 max-w-[85%] ${
                isUser 
                  ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 text-white rounded-2xl rounded-tr-none px-4 py-3' 
                  : 'bg-slate-950/70 border border-white/[0.08] text-slate-200 rounded-2xl rounded-tl-none px-5 py-4'
              }`}>
                <div>{renderFormattedText(message.text)}</div>

                {/* Optional Quick Suggestion Chips */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Follow-up Questions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-left transition-all hover:scale-[1.01]"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950/70 border border-white/[0.08] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">FinAI is synthesizing financial intelligence...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/80 border-t border-white/[0.08]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask FinAI anything about your assets, rebalancing, dividends or market risk..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isTyping}
            className="w-full bg-slate-900 border border-white/[0.1] rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="absolute right-2 p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-30 disabled:hover:bg-cyan-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>Powered by Google Gemini 3.8 Flash</span>
          <span>Educational quantitative analysis • Not formal financial advice</span>
        </div>
      </div>
    </div>
  );
};
