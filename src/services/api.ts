import {
  FinancialGoal,
  LifeRoadmapMilestone,
  ScenarioVariables,
  ScenarioOutturn,
  AutoTransferItem,
  AdvisorChatMessage,
} from '../types/lifepath';

const BASE_URL = '/api';

export interface PortfolioData {
  userName: string;
  membership: string;
  healthScore: number;
  healthScoreStatus: string;
  netWorth: number;
  yoyGrowthPct: number;
  last12MonthsAddition: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  investableSurplus: number;
  idleChecking: number;
  cashEquivalentYieldPct: number;
  monthlySavingsDistribution: {
    taxAdvantaged: number;
    brokerageInvestments: number;
    highYieldCash: number;
  };
}

export interface ScenariosData {
  scenarioA: ScenarioVariables;
  scenarioB: ScenarioVariables;
  outturnA: ScenarioOutturn;
  outturnB: ScenarioOutturn;
}

export interface AdvisorApiResponse {
  reply: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  isGeminiPowered: boolean;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  geminiConfigured: boolean;
  activeModel: string;
}

/**
 * Health check
 */
export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      timestamp: new Date().toISOString(),
      geminiConfigured: false,
      activeModel: 'gemini-3.8-flash (fallback)',
    };
  }
}

/**
 * Portfolio & Cashflow
 */
export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${BASE_URL}/portfolio`);
  if (!res.ok) throw new Error(`Failed to fetch portfolio: HTTP ${res.status}`);
  return await res.json();
}

export async function updatePortfolio(data: Partial<PortfolioData>): Promise<PortfolioData> {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update portfolio: HTTP ${res.status}`);
  return await res.json();
}

export async function executeNextMove(): Promise<{
  success: boolean;
  message: string;
  transferredAmount: number;
  newIdleChecking: number;
  newMonthlySavings: number;
  transferItem: AutoTransferItem;
}> {
  const res = await fetch(`${BASE_URL}/portfolio/execute-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to execute next move: HTTP ${res.status}`);
  return await res.json();
}

/**
 * Goals CRUD
 */
export async function fetchGoals(): Promise<FinancialGoal[]> {
  const res = await fetch(`${BASE_URL}/goals`);
  if (!res.ok) throw new Error(`Failed to fetch goals: HTTP ${res.status}`);
  return await res.json();
}

export async function createGoal(goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
  const res = await fetch(`${BASE_URL}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error(`Failed to create goal: HTTP ${res.status}`);
  return await res.json();
}

export async function updateGoal(id: string, updates: Partial<FinancialGoal>): Promise<FinancialGoal> {
  const res = await fetch(`${BASE_URL}/goals/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update goal: HTTP ${res.status}`);
  return await res.json();
}

export async function deleteGoal(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${BASE_URL}/goals/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete goal: HTTP ${res.status}`);
  return await res.json();
}

/**
 * Roadmap
 */
export async function fetchRoadmap(): Promise<LifeRoadmapMilestone[]> {
  const res = await fetch(`${BASE_URL}/roadmap`);
  if (!res.ok) throw new Error(`Failed to fetch roadmap: HTTP ${res.status}`);
  return await res.json();
}

export async function applyRoadmapOption(option: 'A' | 'B'): Promise<{
  success: boolean;
  message: string;
  updatedMilestone: LifeRoadmapMilestone;
}> {
  const res = await fetch(`${BASE_URL}/roadmap/apply-option`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option }),
  });
  if (!res.ok) throw new Error(`Failed to apply roadmap option: HTTP ${res.status}`);
  return await res.json();
}

/**
 * Scenarios
 */
export async function fetchScenarios(): Promise<ScenariosData> {
  const res = await fetch(`${BASE_URL}/scenarios`);
  if (!res.ok) throw new Error(`Failed to fetch scenarios: HTTP ${res.status}`);
  return await res.json();
}

export async function updateScenarios(data: Partial<ScenariosData>): Promise<ScenariosData> {
  const res = await fetch(`${BASE_URL}/scenarios`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update scenarios: HTTP ${res.status}`);
  return await res.json();
}

/**
 * Transfers
 */
export async function fetchTransfers(): Promise<AutoTransferItem[]> {
  const res = await fetch(`${BASE_URL}/transfers`);
  if (!res.ok) throw new Error(`Failed to fetch transfers: HTTP ${res.status}`);
  return await res.json();
}

export async function addTransfer(transfer: Partial<AutoTransferItem>): Promise<AutoTransferItem> {
  const res = await fetch(`${BASE_URL}/transfers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transfer),
  });
  if (!res.ok) throw new Error(`Failed to add transfer: HTTP ${res.status}`);
  return await res.json();
}

/**
 * AI Advisor & Chat
 */
export async function fetchChatHistory(): Promise<AdvisorChatMessage[]> {
  const res = await fetch(`${BASE_URL}/chat/history`);
  if (!res.ok) throw new Error(`Failed to fetch chat history: HTTP ${res.status}`);
  return await res.json();
}

export async function askAdvisor(
  query: string,
  apiKey?: string
): Promise<AdvisorApiResponse> {
  const res = await fetch(`${BASE_URL}/ai/advisor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-gemini-api-key': apiKey } : {}),
    },
    body: JSON.stringify({ query, apiKey }),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Advisor request failed (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function saveGeminiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/ai/set-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  if (!res.ok) throw new Error(`Failed to save Gemini key: HTTP ${res.status}`);
  return await res.json();
}
