import {
  StitchScreenInfo,
  FinancialGoal,
  LifeRoadmapMilestone,
  AutoTransferItem,
  SpendingCategoryItem,
  ScenarioVariables,
  AdvisorChatMessage
} from '../types/lifepath';

export const STITCH_PROJECT_METADATA = {
  id: '8924478439367092514',
  title: 'Lumo AI Financial Planner',
  designSystem: 'Lumo Prime Trajectory',
  primaryColor: '#532cd8',
  secondaryColor: '#006c4e',
  tertiaryColor: '#9d232a',
  background: '#fcf8ff',
  typography: 'Plus Jakarta Sans (Headlines, Stats & Actions) + Inter (Body & Micro-data)',
  deviceType: 'DESKTOP (2560px Master Layout & Responsive Mobile)',
};

export const STITCH_SCREENS: StitchScreenInfo[] = [
  {
    number: 1,
    id: '1debe339a13543c2bbd2825c70cd3445',
    title: 'Lumo - Home Dashboard',
    description: 'Master command center featuring Consolidated Net Worth trajectory ($142,850), Next Best Move action card, 43.3% savings rate cashflow waterfall, category spending donut, active milestone progress, and auto-piloted transfer streams.',
    deviceType: 'DESKTOP (2560x3284)',
    width: '2560',
    height: '3284',
    screenshotFile: '/stitch_screens/lumo/screen1_dashboard.png',
    htmlFile: '/stitch_screens/lumo/screen1_dashboard.html',
    screenshotHostedUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WPDaim3w_hqMxHcW9wJNQ_wJdjYJSTPJnmZgn1SOTlo-8UU6AD5Jb0PQIQrXN_aqTzO-E4C-1zWxg718FUhylsW32Zp5VsFF8JFzoohunseDEReqxSXNXvOtyxMfkromcPDwyIlLT9cAwZIHmgb_lD72wqxU-wBIjGMSkgHMsQBMG5F8-4UKoH4Q6YI_C9oCdMhOzZ5K2xbb1vCR2CLe1BamJv1ZSJW-PlzJ1b4ADolJ6IbgO7cxMkvTg',
    htmlHostedUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTBiYWEyMDcwMzgzYWRlOTU3MTVjNWE4EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086',
    routeTab: 'dashboard'
  },
  {
    number: 2,
    id: '3824df3164b5462e9742ca55bfdeadd2',
    title: 'Lumo - Life Roadmap Timeline',
    description: 'AI Monte Carlo v4.2 timeline from age 26 to 56 featuring live interactive simulation sliders, dual capital accumulation curves, deficit gap alerts (-$24,500 Home Down Payment in 2031), horizontal milestone cards, and one-click gap solutions.',
    deviceType: 'DESKTOP (2560x3452)',
    width: '2560',
    height: '3452',
    screenshotFile: '/stitch_screens/lumo/screen2_roadmap.png',
    htmlFile: '/stitch_screens/lumo/screen2_roadmap.html',
    screenshotHostedUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XrfqB6Xs0lRpdjMMI6IkRgDW8xwzcWPDiufu0ef4xI2nQl8hnED-lppnpOpRy7x66i11wx1nsXVfWhbeWAMQYAIhwJ5Mnppt0Ad69o6sNjOuJ_QUDO7O2Fw7SCT-SZdhIXeyN15XF-9pdo1jEjobBTgCMcuhRT8jQ0K_nKqd9pm4X9rYx6jkk3wYYQ_KbtVoL4lO5uZUKNXw8Nz8GIaWVSfuADWJgtKTJ5DWM8ByNvBtsDG_BNIV63qcU',
    htmlHostedUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE2MWU1YzYwOTI1ZDg5ZTQ0M2MxODQ5EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086',
    routeTab: 'roadmap'
  },
  {
    number: 3,
    id: '7507ec71a66248d4ab9f4bd0f67ea25d',
    title: 'Lumo - Scenario Simulator',
    description: 'Dynamic sensitivity engine comparing Baseline Scenario A vs AI-Enhanced Scenario B across 10,000 Monte Carlo runs, 5 instant stress presets, side-by-side interactive sliders, and 30-year compound net worth forecast comparison.',
    deviceType: 'DESKTOP (2560x4686)',
    width: '2560',
    height: '4686',
    screenshotFile: '/stitch_screens/lumo/screen3_simulator.png',
    htmlFile: '/stitch_screens/lumo/screen3_simulator.html',
    screenshotHostedUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Xcc0NHyTZem7rcEIb48KrRn1nrJO5rpxDif0PttE6iQVQ2QSkuo1ppFzPRUuXoaEAiIef5DDtfOPvpFn7jBhVvyzUVZsx3fWMoPKaSZh96S5bbA02kRwS-DKHOs2-r1JW6arKwgokPUAwo-0UK6iNoxQ43w-to4sXYcdTcbI41UrrYR7MIbGE99peaHhJdoatimMCIQlOFFiRuZpv8y20gDUdAbu5QTFrB5_VTTjXk_L2c6DuYZyAWbPo',
    htmlHostedUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE4NDQ0NTkwOTEwNGZjYzMzMGJjMjBmEgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086',
    routeTab: 'simulator'
  },
  {
    number: 4,
    id: '91d638c3451945b49052f5b103c5efb9',
    title: 'Lumo - Goals Manager',
    description: 'Milestone orchestrator with 3 horizon columns (Short-term 0-3 yrs, Medium-term 3-10 yrs, Long-term 10+ yrs), Smart Priority cascade rules, surplus auto-routing ($4,800/mo), and interactive goal creation drawer.',
    deviceType: 'DESKTOP (2560x2868)',
    width: '2560',
    height: '2868',
    screenshotFile: '/stitch_screens/lumo/screen4_goals.png',
    htmlFile: '/stitch_screens/lumo/screen4_goals.html',
    screenshotHostedUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UX9cS4YDXcWPln5G_qhU3PwqyrMrIPIviVh8nbeRTUZaDX2CCeWFPqWYgLhCrMSf792yrlJadvDpzOVynrT24GcgNkuYXrSBTlPDSkf-32rof_jacYQ_MJdcktCGaicsh3YDn-B8uRqU6Wnd7hL9DxA-VlCXM0EA11pMxtrruszIYy9p-G0cK4Ooh-nZ07hhIsOYXHc7K-F838v9DnzKdvx5GYVgl5BaDYKd4w9okAB1dsjpqkqTMYxNs',
    htmlHostedUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE5MDhhMzcwNzNhZjEzOWVjMzc2NjA0EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086',
    routeTab: 'goals'
  }
];

export const INITIAL_GOALS: FinancialGoal[] = [
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
];

export const INITIAL_ROADMAP_MILESTONES: LifeRoadmapMilestone[] = [
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
];

export const INITIAL_TRANSFERS: AutoTransferItem[] = [
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
];

export const INITIAL_SPENDING_CATEGORIES: SpendingCategoryItem[] = [
  { name: 'Rent & Mort.', percentage: 34, amount: 1581, color: '#532cd8' },
  { name: 'Investments', percentage: 28, amount: 1302, color: '#006c4e' },
  { name: 'Lifestyle', percentage: 18, amount: 837, color: '#6c4cf1' },
  { name: 'Groceries', percentage: 14, amount: 651, color: '#ffb3b0' },
  { name: 'Utilities', percentage: 6, amount: 279, color: '#c9c4d8' },
];

export const INITIAL_SCENARIO_A: ScenarioVariables = {
  monthlySavings: 3550,
  incomeGrowth: 5.0,
  expenseInflation: 3.0,
  expectedRoi: 7.5,
  retirementAge: 58,
};

export const INITIAL_SCENARIO_B: ScenarioVariables = {
  monthlySavings: 4150,
  incomeGrowth: 7.0,
  expenseInflation: 2.8,
  expectedRoi: 9.2,
  retirementAge: 53,
};

export const INITIAL_ADVISOR_MESSAGES: AdvisorChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Good morning Alex! I'm Lumo, your AI Financial Planner. I've continuously analyzed your $142,850 consolidated portfolio and identified a high-leverage move: you have $3,140 in idle checking that can unlock +$18,400 over a 10-year compound window if automated into index funds. How can I assist you with your goals today?",
    timestamp: '9:41 AM',
    tags: ['Automate Surplus', '2031 Home Gap', 'Monte Carlo Stress Test', 'Retirement Curve']
  }
];
