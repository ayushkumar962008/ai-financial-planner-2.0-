export type AssetCategory = 'Equities' | 'Fixed Income' | 'Crypto' | 'Cash & Equivalents' | 'Real Estate' | 'Commodities';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  category: AssetCategory;
  sector: string;
  dividendYield: number; // in percent, e.g., 2.5 for 2.5%
  allocationPercent?: number;
  totalValue?: number;
  totalGain?: number;
  totalGainPercent?: number;
}

export interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  high52W: number;
  low52W: number;
  beta: number;
  volume: string;
  sector: string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  sentimentScore: number; // 0 to 100
  aiSummary: string;
}

export interface DividendMonth {
  month: string;
  amount: number;
  isProjected: boolean;
  companies: string[];
}

export interface ExDividendDate {
  symbol: string;
  company: string;
  exDate: string;
  payDate: string;
  amountPerShare: number;
  estPayout: number;
}

export interface RiskMetrics {
  riskScore: number; // 0 to 100
  riskLevel: 'Conservative' | 'Moderate' | 'Moderate-Aggressive' | 'Aggressive';
  sharpeRatio: number;
  portfolioBeta: number;
  maxDrawdown: number; // negative percent
  volatility: number; // percent
  diversificationScore: number; // 0 to 100
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  estimatedImpactPercent: number;
  affectedSectors: { sector: string; impact: number }[];
  aiAdvice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isAiAnalysis?: boolean;
}

export interface PortfolioPerformancePoint {
  date: string;
  portfolio: number;
  sp500: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';
