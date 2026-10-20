import { Currency } from '../utils/lifepathFormatters';

export type ActiveTab = 'dashboard' | 'overview' | 'goals' | 'roadmap' | 'simulator' | 'compare' | 'advisor' | 'gallery';

export interface StitchScreenInfo {
  id: string;
  number: number;
  title: string;
  description: string;
  deviceType: string;
  width: string;
  height: string;
  screenshotFile: string;
  htmlFile: string;
  screenshotHostedUrl: string;
  htmlHostedUrl: string;
  routeTab: ActiveTab;
}

export interface FinancialGoal {
  id: string;
  title: string;
  icon: string;
  targetAmount: number; // in USD
  currentAmount: number;
  monthlyRequired: number;
  status: 'on_track' | 'attention' | 'ahead';
  statusLabel: string;
  horizon: 'short' | 'medium' | 'long';
  priority: 'high' | 'medium' | 'low';
  targetYear: number;
  targetDateLabel: string;
  note: string;
  accountType?: string;
}

export interface LifeRoadmapMilestone {
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

export interface AutoTransferItem {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  status: 'Settled' | 'Queued' | 'Scheduled';
  icon: string;
  date: string;
}

export interface SpendingCategoryItem {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface AdvisorChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tags?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
}
