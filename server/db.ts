import fs from 'fs';
import path from 'path';

export interface DatabaseSchema {
  portfolio: {
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
  };
  goals: Array<{
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
    accountType?: string;
  }>;
  roadmap: Array<{
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
  }>;
  scenarios: {
    scenarioA: {
      monthlySavings: number;
      incomeGrowth: number;
      expenseInflation: number;
      expectedRoi: number;
      retirementAge: number;
    };
    scenarioB: {
      monthlySavings: number;
      incomeGrowth: number;
      expenseInflation: number;
      expectedRoi: number;
      retirementAge: number;
    };
    activeScenario: 'A' | 'B';
  };
  transfers: Array<{
    id: string;
    name: string;
    subtitle: string;
    amount: number;
    status: 'Settled' | 'Queued' | 'Scheduled';
    icon: string;
    date: string;
  }>;
  chatHistory: Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    tags?: string[];
    metrics?: {
      label: string;
      value: string;
    }[];
  }>;
}

function resolveDbPath(): string {
  const candidates = [
    path.join(process.cwd(), 'database', 'lumo_database.json'),
    path.join(process.cwd(), '..', 'database', 'lumo_database.json'),
    path.join(process.cwd(), 'server', 'data', 'lumo_database.json'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(process.cwd(), 'database', 'lumo_database.json');
}

const DB_PATH = resolveDbPath();

const INITIAL_DATA: DatabaseSchema = {
  portfolio: {
    userName: 'Maya (Alex Vance)',
    membership: 'PRO Member',
    netWorth: 142850,
    yoyGrowthPct: 14.2,
    last12MonthsAddition: 17680,
    healthScore: 84,
    healthScoreStatus: 'Prime Trajectory',
    monthlyIncome: 8200,
    monthlyExpenses: 4650,
    monthlySavings: 3550,
    investableSurplus: 2100,
    savingsRatePct: 43.3,
    idleChecking: 3140,
    nextMoveExecuted: false,
  },
  goals: [
    {
      id: 'goal-emergency',
      title: 'Emergency Cushion',
      icon: '🛡️',
      targetAmount: 25000,
      currentAmount: 23000,
      monthlyRequired: 450,
      status: 'ahead',
      statusLabel: 'Ahead by 3 months',
      horizon: 'short',
      priority: 'high',
      targetYear: 2025,
      targetDateLabel: 'June 2025',
      note: '6 months essential liquid buffer in high-yield vault.',
      accountType: 'Liquid High-Yield HYSA (4.5%)'
    },
    {
      id: 'goal-tokyo',
      title: 'Tokyo Sabbatical',
      icon: '🇯🇵',
      targetAmount: 8000,
      currentAmount: 6240,
      monthlyRequired: 380,
      status: 'on_track',
      statusLabel: 'On Target (Apr 2025)',
      horizon: 'short',
      priority: 'medium',
      targetYear: 2025,
      targetDateLabel: 'April 2025',
      note: 'Japan & Nordic sabbatical travel fund.',
      accountType: 'Travel Stash Vault'
    },
    {
      id: 'goal-roth',
      title: 'Roth IRA Max-Out',
      icon: '🚀',
      targetAmount: 7000,
      currentAmount: 5950,
      monthlyRequired: 350,
      status: 'on_track',
      statusLabel: 'Auto-contribution active',
      horizon: 'short',
      priority: 'high',
      targetYear: 2025,
      targetDateLabel: 'Dec 2025',
      note: 'Maximum tax-advantaged annual retirement contribution.',
      accountType: 'Vanguard Total Stock Market'
    },
    {
      id: 'goal-downpayment',
      title: 'Down Payment 2028',
      icon: '🏡',
      targetAmount: 100000,
      currentAmount: 38000,
      monthlyRequired: 1420,
      status: 'attention',
      statusLabel: 'Behind by $120/mo',
      horizon: 'medium',
      priority: 'high',
      targetYear: 2028,
      targetDateLabel: 'July 2028',
      note: '20% down payment on urban condo property + closing reserve.',
      accountType: 'Treasury Bills & Index Funds'
    },
    {
      id: 'goal-studio',
      title: 'Start Boutique Studio',
      icon: '🏪',
      targetAmount: 50000,
      currentAmount: 18000,
      monthlyRequired: 650,
      status: 'on_track',
      statusLabel: 'On Track (2029)',
      horizon: 'medium',
      priority: 'medium',
      targetYear: 2029,
      targetDateLabel: 'Jan 2029',
      note: 'Seed capital & 12 months runway for creative consulting studio.',
      accountType: 'Balanced Growth Portfolio'
    },
    {
      id: 'goal-fire',
      title: 'Financial Independence (Coast FIRE)',
      icon: '⭐',
      targetAmount: 1800000,
      currentAmount: 142850,
      monthlyRequired: 2100,
      status: 'ahead',
      statusLabel: '94% modeled certainty',
      horizon: 'long',
      priority: 'high',
      targetYear: 2052,
      targetDateLabel: 'Age 53 (2052)',
      note: 'Full early retirement corpus with 4% safe withdrawal rate.',
      accountType: 'Global Equity Index & REITs'
    }
  ],
  roadmap: [
    {
      id: 'm-2025',
      year: 2025,
      age: 26,
      title: 'Emergency Reserve',
      category: 'Safety',
      icon: 'shield_with_heart',
      targetAmount: 25000,
      allocatedAmount: 25000,
      status: 'on_track',
      note: '6 months essential liquid buffer in high-yield vault.'
    },
    {
      id: 'm-2027',
      year: 2027,
      age: 28,
      title: "Master's Career Pivot",
      category: 'Career',
      icon: 'school',
      targetAmount: 40000,
      allocatedAmount: 32000,
      status: 'on_track',
      note: 'Part-time AI / Design engineering graduate certificate.'
    },
    {
      id: 'm-2029',
      year: 2029,
      age: 30,
      title: 'Dream Wedding & Trip',
      category: 'Lifestyle',
      icon: 'favorite',
      targetAmount: 35000,
      allocatedAmount: 24500,
      status: 'on_track',
      note: 'Celebration in Amalfi Coast plus sabbatical month.'
    },
    {
      id: 'm-2031',
      year: 2031,
      age: 32,
      title: 'First Home Down Payment',
      category: 'Real Estate',
      icon: 'home',
      targetAmount: 150000,
      allocatedAmount: 125500,
      status: 'alert',
      deficitAmount: 24500,
      note: '20% down on urban property + closing & reserve.'
    },
    {
      id: 'm-2038',
      year: 2038,
      age: 39,
      title: 'Start Boutique Studio',
      category: 'Business',
      icon: 'storefront',
      targetAmount: 120000,
      allocatedAmount: 55000,
      status: 'upcoming',
      note: 'Founding capital & 18 months runway for independent agency.'
    },
    {
      id: 'm-2052',
      year: 2052,
      age: 53,
      title: 'Financial Independence',
      category: 'Retirement',
      icon: 'wb_sunny',
      targetAmount: 2850000,
      allocatedAmount: 2680000,
      status: 'north_star',
      note: 'Full early retirement at age 53 with 4% safe withdrawal rule.'
    }
  ],
  scenarios: {
    scenarioA: {
      monthlySavings: 3550,
      incomeGrowth: 5.0,
      expenseInflation: 3.0,
      expectedRoi: 7.5,
      retirementAge: 58,
    },
    scenarioB: {
      monthlySavings: 4150,
      incomeGrowth: 7.0,
      expenseInflation: 2.8,
      expectedRoi: 9.2,
      retirementAge: 53,
    },
    activeScenario: 'B',
  },
  transfers: [
    {
      id: 't-1',
      name: 'Vanguard S&P 500',
      subtitle: 'Weekly DCA • Yesterday',
      amount: 250.00,
      status: 'Settled',
      icon: '🌱',
      date: 'Yesterday'
    },
    {
      id: 't-2',
      name: 'Ally High-Yield 4.5%',
      subtitle: 'Auto Savings • Oct 28',
      amount: 400.00,
      status: 'Settled',
      icon: '🏦',
      date: 'Oct 28'
    },
    {
      id: 't-3',
      name: 'Travel Stash Vault',
      subtitle: 'Scheduled • Nov 1',
      amount: 150.00,
      status: 'Queued',
      icon: '✈️',
      date: 'Nov 1'
    }
  ],
  chatHistory: [
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Good morning! I'm Lumo, your AI Financial Planner powered by Gemini. I have direct access to your real-time $142,850 portfolio database. How can I assist with your cashflow, 2031 Home Down Payment gap, or retirement scenarios today?",
      timestamp: '9:41 AM',
      tags: ['Live Database Synced', 'Monte Carlo Engine']
    }
  ]
};

class LumoDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database, initializing with default schema:', err);
    }
    this.save(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private save(newData: DatabaseSchema): void {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database:', err);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public getPortfolio() {
    return this.data.portfolio;
  }

  public updatePortfolio(partial: Partial<DatabaseSchema['portfolio']>) {
    this.data.portfolio = { ...this.data.portfolio, ...partial };
    this.save(this.data);
    return this.data.portfolio;
  }

  public executeNextMove(): { portfolio: DatabaseSchema['portfolio']; transfer: any } {
    if (!this.data.portfolio.nextMoveExecuted) {
      this.data.portfolio.nextMoveExecuted = true;
      this.data.portfolio.idleChecking = Math.max(0, this.data.portfolio.idleChecking - 450);
      this.data.portfolio.netWorth += 450;
      this.data.portfolio.investableSurplus += 450;

      const newTransfer = {
        id: `t-${Date.now()}`,
        name: 'Vanguard Index Fund (Auto Move)',
        subtitle: 'Idle Checking Sweep • Just now',
        amount: 450.0,
        status: 'Settled' as const,
        icon: '⚡',
        date: 'Just now',
      };
      this.data.transfers.unshift(newTransfer);

      this.save(this.data);
      return { portfolio: this.data.portfolio, transfer: newTransfer };
    }
    return { portfolio: this.data.portfolio, transfer: null };
  }

  public getGoals() {
    return this.data.goals;
  }

  public addGoal(goal: DatabaseSchema['goals'][0]) {
    this.data.goals.unshift(goal);
    this.save(this.data);
    return goal;
  }

  public updateGoal(id: string, partial: Partial<DatabaseSchema['goals'][0]>) {
    const idx = this.data.goals.findIndex((g) => g.id === id);
    if (idx !== -1) {
      this.data.goals[idx] = { ...this.data.goals[idx], ...partial };
      this.save(this.data);
      return this.data.goals[idx];
    }
    return null;
  }

  public deleteGoal(id: string) {
    const initialLen = this.data.goals.length;
    this.data.goals = this.data.goals.filter((g) => g.id !== id);
    if (this.data.goals.length !== initialLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }

  public getRoadmap() {
    return this.data.roadmap;
  }

  public updateRoadmapMilestone(id: string, partial: Partial<DatabaseSchema['roadmap'][0]>) {
    const idx = this.data.roadmap.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.roadmap[idx] = { ...this.data.roadmap[idx], ...partial };
      this.save(this.data);
      return this.data.roadmap[idx];
    }
    return null;
  }

  public applyRoadmapOption(option: 'A' | 'B') {
    if (option === 'A') {
      this.data.portfolio.monthlySavings += 210;
      this.data.roadmap = this.data.roadmap.map((m) =>
        m.year === 2031
          ? {
              ...m,
              allocatedAmount: 150000,
              status: 'on_track' as const,
              deficitAmount: 0,
              note: 'Gap closed: monthly savings increased by +$210/mo.',
            }
          : m
      );
    } else {
      this.data.roadmap = this.data.roadmap.map((m) =>
        m.year === 2031
          ? {
              ...m,
              year: 2032,
              age: 33,
              allocatedAmount: 150000,
              status: 'on_track' as const,
              deficitAmount: 0,
              note: 'Horizon shifted to Q1 2032 with zero lifestyle squeeze.',
            }
          : m
      );
    }
    this.save(this.data);
    return { portfolio: this.data.portfolio, roadmap: this.data.roadmap };
  }

  public getScenarios() {
    return this.data.scenarios;
  }

  public updateScenarios(scenarios: Partial<DatabaseSchema['scenarios']>) {
    this.data.scenarios = { ...this.data.scenarios, ...scenarios };
    this.save(this.data);
    return this.data.scenarios;
  }

  public getTransfers() {
    return this.data.transfers;
  }

  public addTransfer(transfer: DatabaseSchema['transfers'][0]) {
    this.data.transfers.unshift(transfer);
    this.save(this.data);
    return transfer;
  }

  public getChatHistory() {
    return this.data.chatHistory;
  }

  public addChatMessage(msg: DatabaseSchema['chatHistory'][0]) {
    this.data.chatHistory.push(msg);
    // Keep last 40 messages
    if (this.data.chatHistory.length > 40) {
      this.data.chatHistory = this.data.chatHistory.slice(-40);
    }
    this.save(this.data);
    return msg;
  }
}

export const db = new LumoDatabase();
