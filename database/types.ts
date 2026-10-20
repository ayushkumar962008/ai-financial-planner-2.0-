/**
 * Lumo Database Types & Schema Definitions
 */

export interface PortfolioRecord {
  userName: string;
  membership: string;
  netWorth: number;
  yoyGrowthPct: number;
  last12MonthsAddition: number;
  healthScore: number;
  healthScoreStatus: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  investableSurplus: number;
  savingsRatePct: number;
  idleChecking: number;
  nextMoveExecuted: boolean;
}

export interface FinancialGoalRecord {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  monthlyRequired: number;
  status: 'on_track' | 'attention' | 'ahead';
  statusLabel: string;
  horizon: 'short' | 'medium' | 'long';
  priority: 'high' | 'medium' | 'low';
  targetYear: number;
  targetDateLabel: string;
  note: string;
  accountType: string;
}

export interface LifeRoadmapRecord {
  id: string;
  year: number;
  age: number;
  title: string;
  category: string;
  icon: string;
  targetAmount: number;
  allocatedAmount: number;
  status: 'on_track' | 'alert' | 'upcoming' | 'north_star';
  deficitAmount?: number;
  note: string;
}

export interface ScenarioVariables {
  monthlySavings: number;
  incomeGrowth: number;
  expenseInflation: number;
  expectedRoi: number;
  retirementAge: number;
}

export interface ScenarioOutturn {
  netWorthAt40: number;
  netWorthAt55: number;
  goalsAchieved: string;
  goalDetail: string;
}

export interface ScenariosRecord {
  scenarioA: ScenarioVariables;
  scenarioB: ScenarioVariables;
  outturnA: ScenarioOutturn;
  outturnB: ScenarioOutturn;
}

export interface TransferRecord {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  status: 'Settled' | 'Queued' | 'Scheduled';
  icon: string;
  date: string;
}

export interface ChatMessageRecord {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tags?: string[];
  metrics?: { label: string; value: string }[];
}

export interface LumoDatabaseSchema {
  portfolio: PortfolioRecord;
  goals: FinancialGoalRecord[];
  roadmap: LifeRoadmapRecord[];
  scenarios: ScenariosRecord;
  transfers: TransferRecord[];
  chatHistory: ChatMessageRecord[];
}
