import { GoogleGenAI } from '@google/genai';
import { db } from './db.js';

export interface GeminiAdvisorResponse {
  reply: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  isGeminiPowered: boolean;
}

/**
 * Builds real-time context from the database for Gemini prompt grounding
 */
function buildFinancialContext(): string {
  const data = db.get();
  const p = data.portfolio;
  const sA = data.scenarios.scenarioA;
  const sB = data.scenarios.scenarioB;

  return `
USER TELEMETRY:
- User: ${p.userName}
- Net Worth: $${p.netWorth.toLocaleString()} (+${p.yoyGrowthPct}% YoY)
- Monthly Income: $${p.monthlyIncome.toLocaleString()} | Monthly Expenses: $${p.monthlyExpenses.toLocaleString()}
- Monthly Savings: $${p.monthlySavings.toLocaleString()} (43.3% savings rate)
- Investable Surplus: $${p.investableSurplus.toLocaleString()}/mo | Idle Checking: $${p.idleChecking.toLocaleString()}
- Emergency Fund: $23,000 saved of $25,000 in 4.5% HYSA (5.0 months living buffer)
- 2031 Home Down Payment: $125,500 projected vs $150,000 target (-$24,500 deficit). Solved with +$210/mo (Option A) or +8 months (Option B).
- Tokyo Sabbatical: $6,240 saved of $8,000 target (78% funded, completes April 2025 at $380/mo).
- Retirement: Target Age 53 (2052) at $2.85M corpus (supporting $114,000/yr safe withdrawal with 94% certainty).
`;
}

/**
 * Deterministic fiduciary quantitative engine
 * Direct, concise, relevant, and free of fluff or raw markdown clutter
 */
function fallbackFinancialEngine(query: string): GeminiAdvisorResponse {
  const q = query.toLowerCase().trim();
  const data = db.get();
  const p = data.portfolio;

  // 1. GREETINGS
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you') || q.includes('help')) {
    return {
      reply: `### Hello Maya! I am Lumo, your AI financial copilot.

Here is your current financial summary:
• Net Worth: $${p.netWorth.toLocaleString()} (+14.2% YoY growth)
• Cashflow: Saving $${p.monthlySavings.toLocaleString()}/mo (43.3% savings rate)
• Liquid Buffer: $23,000 in 4.5% Emergency HYSA (5 months covered)
• Immediate Action: $${p.idleChecking.toLocaleString()} in checking is ready for surplus compounding.

Ask me about your 2031 house down payment, major purchases, investments, or early retirement.`,
      tags: ['Lumo Copilot', 'Overview'],
      metrics: [
        { label: 'Net Worth', value: `$${p.netWorth.toLocaleString()}` },
        { label: 'Savings Rate', value: '43.3%' },
        { label: 'Emergency Fund', value: '$23,000' },
      ],
      isGeminiPowered: false,
    };
  }

  // 2. MAJOR PURCHASES & AFFORDABILITY (Car, Tesla, House, Vacation, Expense)
  if (
    q.includes('afford') ||
    q.includes('buy a car') ||
    q.includes('car') ||
    q.includes('tesla') ||
    q.includes('can i buy') ||
    q.includes('purchase') ||
    q.includes('spend')
  ) {
    return {
      reply: `### Affordability Assessment for Major Purchases:

1. Cashflow Capacity: You generate $${p.investableSurplus.toLocaleString()}/mo in investable surplus and hold $${p.idleChecking.toLocaleString()} in checking buffer.
2. Safe Purchase Limit: Cash purchases up to $4,500 are fully affordable today from your monthly surplus without touching your $23,000 emergency fund.
3. Vehicle Financing: A $500–$650/mo car payment reduces your savings rate from 43.3% to ~36%, delaying your early retirement by ~14 months.
4. Recommendation: If buying a car, cap monthly payments under $450/mo to preserve your 2031 Home Down Payment target.`,
      tags: ['Affordability', 'Purchasing Capacity'],
      metrics: [
        { label: 'Monthly Surplus', value: `$${p.investableSurplus.toLocaleString()}` },
        { label: 'Safe Cash Limit', value: '$4,500' },
        { label: 'Max Car Payment', value: '<$450/mo' },
      ],
      isGeminiPowered: false,
    };
  }

  // 3. TOKYO SABBATICAL & TRAVEL
  if (q.includes('tokyo') || q.includes('sabbatical') || q.includes('travel') || q.includes('japan') || q.includes('vacation')) {
    const tokyoGoal = data.goals.find((g) => g.id === 'goal-tokyo') || {
      targetAmount: 8000,
      currentAmount: 6240,
      monthlyRequired: 380,
    };
    const pct = Math.round((tokyoGoal.currentAmount / tokyoGoal.targetAmount) * 100);
    const remaining = tokyoGoal.targetAmount - tokyoGoal.currentAmount;

    return {
      reply: `### Tokyo Sabbatical Fund Status:

• Progress: $${tokyoGoal.currentAmount.toLocaleString()} saved of $${tokyoGoal.targetAmount.toLocaleString()} target (${pct}% funded).
• Remaining Need: $${remaining.toLocaleString()} to reach full budget.
• Timeline: At $${tokyoGoal.monthlyRequired}/mo, you will achieve 100% funding by April 2025.
• Quick Action: You have $${p.idleChecking.toLocaleString()} in checking. A one-time $1,000 transfer makes you 90% funded immediately.`,
      tags: ['Travel Sabbatical', 'Goal Tracking'],
      metrics: [
        { label: 'Progress', value: `${pct}%` },
        { label: 'Remaining', value: `$${remaining.toLocaleString()}` },
        { label: 'Target Date', value: 'April 2025' },
      ],
      isGeminiPowered: false,
    };
  }

  // 4. WEALTH MILESTONES ($500K, $1 MILLION)
  if (q.includes('million') || q.includes('1m') || q.includes('500k') || q.includes('milestone') || q.includes('when will i')) {
    return {
      reply: `### Projected Wealth Milestones (at $3,550/mo savings + 8.5% ROI):

1. $250,000 Milestone: Projected in 2.1 years (mid-2028 at Age 29).
2. $500,000 Milestone: Projected in 5.8 years (early 2032 at Age 33).
3. $1,000,000 (Millionaire): Projected in 11.2 years (mid-2037 at Age 38).
4. $2,850,000 (Early FIRE): Projected at Age 53 (2052) under Scenario B.`,
      tags: ['Milestones', 'Wealth Forecast'],
      metrics: [
        { label: '$250k Milestone', value: 'Mid 2028' },
        { label: '$500k Milestone', value: 'Early 2032' },
        { label: '$1M Net Worth', value: 'Age 38 (2037)' },
      ],
      isGeminiPowered: false,
    };
  }

  // 5. EMERGENCY FUND & SAFETY
  if (q.includes('emergency') || q.includes('cushion') || q.includes('safety') || q.includes('hysa')) {
    return {
      reply: `### Emergency Cushion Breakdown:

• Current Balance: $23,000 of $25,000 target (92% funded).
• Coverage: 5.0 months of living expenses ($4,650/mo).
• Yield: Parked in 4.5% High-Yield Vault earning +$1,035/year risk-free.
• Fiduciary Note: Your emergency fund is in excellent shape; route new cash into index funds rather than overfunding cash.`,
      tags: ['Emergency Fund', 'Liquid Reserves'],
      metrics: [
        { label: 'Funded', value: '92.0%' },
        { label: 'Coverage', value: '5.0 Months' },
        { label: 'Annual APY', value: '+$1,035/yr' },
      ],
      isGeminiPowered: false,
    };
  }

  // 6. INVESTMENTS & STOCKS
  if (q.includes('invest') || q.includes('stock') || q.includes('etf') || q.includes('vanguard') || q.includes('index')) {
    return {
      reply: `### Investment Strategy & Asset Allocation:

• Current Savings Deployment: $3,550/mo split across 401(k), Roth IRA, and Index Funds.
• Core Allocation: Broad market global index funds (e.g. S&P 500 / VTI) targeting an 8.5% historical CAGR.
• Quick Win: Sweeping $450/month from your $${p.idleChecking.toLocaleString()} checking into index funds compounds to +$18,400 extra gains over 10 years.`,
      tags: ['Investments', 'Index Funds'],
      metrics: [
        { label: 'Expected CAGR', value: '8.5%' },
        { label: 'Monthly Equity', value: '$2,840/mo' },
        { label: '10-Yr Sweep Gain', value: '+$18,400' },
      ],
      isGeminiPowered: false,
    };
  }

  // 7. CRYPTO & BITCOIN
  if (q.includes('crypto') || q.includes('bitcoin') || q.includes('btc') || q.includes('eth')) {
    return {
      reply: `### Cryptocurrency & Speculative Assets Advice:

• Allocation Rule: Limit high-volatility crypto to 3%–5% of your liquid net worth ($4,300–$7,100).
• Protection Rule: Never draw crypto capital from your Emergency Fund ($23,000) or Home Down Payment.
• Execution: If investing in Bitcoin or Ethereum, DCA maximum $100–$150/mo strictly out of discretionary allowance.`,
      tags: ['Crypto Strategy', 'Risk Management'],
      metrics: [
        { label: 'Max Safe Crypto', value: '3% - 5%' },
        { label: 'Max Safe Capital', value: '$4,300 - $7,100' },
        { label: 'Monthly Limit', value: '<$150/mo' },
      ],
      isGeminiPowered: false,
    };
  }

  // 8. 2031 HOME DOWN PAYMENT & DEFICIT
  if (q.includes('home') || q.includes('down payment') || q.includes('deficit') || q.includes('gap') || q.includes('house')) {
    return {
      reply: `### 2031 Home Down Payment Gap Analysis ($150,000 Target):

• The Shortfall: At your current savings rate, you reach $125,500 by July 2031, leaving a -$24,500 deficit.
• Solution Option A: Increase down payment allocation by +$210/mo from idle checking. Closes the gap by Q2 2031 with zero lifestyle cut.
• Solution Option B: Shift timeline by 8 months to March 2032. Achieves 100% funding at your existing pace.`,
      tags: ['Home Down Payment', 'Deficit Resolution'],
      metrics: [
        { label: 'Deficit Gap', value: '-$24,500' },
        { label: 'Required Boost', value: '+$210/mo' },
        { label: 'New Feasibility', value: '96.2%' },
      ],
      isGeminiPowered: false,
    };
  }

  // 9. RETIREMENT & FIRE
  if (q.includes('retire') || q.includes('fire') || q.includes('53') || q.includes('58')) {
    return {
      reply: `### Early Retirement Comparison (Age 53 vs Age 58):

• Age 53 Plan (Scenario B): $2,850,000 corpus providing $114,000/yr safe withdrawal (4% rule). Model certainty is 94%.
• Age 58 Baseline (Scenario A): $3,450,000 corpus, requiring 5 additional working years.
• Key Lever: Scenario B's 7% salary growth and disciplined surplus sweep shaves 5 years off your working career.`,
      tags: ['Early Retirement', 'FIRE Plan'],
      metrics: [
        { label: 'Early FIRE Age', value: 'Age 53' },
        { label: 'Target Corpus', value: '$2.85M' },
        { label: 'Annual Income', value: '$114,000/yr' },
      ],
      isGeminiPowered: false,
    };
  }

  // 10. SPENDING & BUDGET
  if (q.includes('spend') || q.includes('expense') || q.includes('budget') || q.includes('cut')) {
    return {
      reply: `### Monthly Spending Breakdown ($4,650/mo):

• Housing: $2,200/mo (47% of total expenses)
• Food & Dining: $950/mo (20% of expenses)
• Travel & Leisure: $630/mo (14% of expenses)
• Discretionary: $450/mo (10% of expenses)
• Tech & Subscriptions: $420/mo (9% of expenses)

Trimming $150 from dining and $90 from tech subscriptions frees up +$240/mo, easily closing your 2031 home deficit.`,
      tags: ['Budget Breakdown', 'Cashflow Optimization'],
      metrics: [
        { label: 'Living Ratio', value: '56.7%' },
        { label: 'Savings Ratio', value: '43.3%' },
        { label: 'Trim Potential', value: '+$240/mo' },
      ],
      isGeminiPowered: false,
    };
  }

  // 11. GENERAL CONCISE ANSWER
  return {
    reply: `### Financial Advisory Analysis for: "${query}"

• Your Current Status: Net Worth $${p.netWorth.toLocaleString()}, saving $${p.monthlySavings.toLocaleString()}/mo (43.3% savings rate).
• Safety Reserves: $23,000 fully liquid in 4.5% HYSA covering 5 months of living expenses.
• Key Priority: Fix the -$24,500 Home Down Payment gap for 2031 using +$210/mo from checking.
• Long-Term Path: On track for early retirement at Age 53 with $2.85M corpus.`,
    tags: ['Lumo Copilot', 'Telemetry Synced'],
    metrics: [
      { label: 'Net Worth', value: `$${p.netWorth.toLocaleString()}` },
      { label: 'Savings Rate', value: '43.3%' },
      { label: 'Health Score', value: `${p.healthScore}/100` },
    ],
    isGeminiPowered: false,
  };
}

/**
 * Main query function: calls Gemini 3.8 Flash or clean quantitative engine
 */
export async function askGeminiAdvisor(
  userQuery: string,
  clientApiKey?: string
): Promise<GeminiAdvisorResponse> {
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

  if (!apiKey) {
    return fallbackFinancialEngine(userQuery);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = buildFinancialContext();

    const systemInstruction = `You are Lumo, an elite fiduciary AI Financial Planner.
Maya's live financial data:
${context}

Instructions:
1. Answer the question directly and concisely in 2 to 4 bullet points.
2. Avoid generic disclaimers, rambling background theory, or irrelevant filler.
3. Ground answers directly in Maya's numbers: Net Worth $143,300, Savings $3,550/mo, Idle Checking $2,690, 2031 Home Gap -$24,500, Emergency Fund $23,000.
4. Keep output clean, crisp, and actionable.`;

    let replyText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userQuery,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
      replyText = response.text || '';
    } catch (modelErr: any) {
      console.warn('generateContent fallback to interactions:', modelErr?.message || modelErr);
      try {
        const interaction = await (ai as any).interactions.create({
          model: 'gemini-3.8-flash',
          input: `${systemInstruction}\n\nQuestion: ${userQuery}`,
        });
        replyText = interaction?.output_text || '';
      } catch (e) {
        console.warn('interactions fallback failed:', e);
      }
    }

    if (!replyText || replyText.trim().length === 0) {
      const fallback = fallbackFinancialEngine(userQuery);
      fallback.tags.push('Fallback Engaged');
      return fallback;
    }

    return {
      reply: replyText,
      tags: ['Gemini 3.8 Flash', 'Grounded Database'],
      isGeminiPowered: true,
    };
  } catch (err: any) {
    console.warn('Gemini API call failed, falling back to local engine:', err?.message || err);
    const fallback = fallbackFinancialEngine(userQuery);
    fallback.tags.push('Gemini Fallback');
    return fallback;
  }
}
