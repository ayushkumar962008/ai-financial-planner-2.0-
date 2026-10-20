# Lumo Persistent Database

This folder contains the persistence layer and data schemas for the **Lumo AI Financial Planner** application.

---

## 📂 Files Overview

- **`lumo_database.json`**: The active, live database storing Maya's balance sheet, goals, roadmap, scenarios, transfers, and AI consultation logs.
- **`seed.json`**: Initial baseline state used for clean deployments or resetting the environment.
- **`types.ts`**: TypeScript interfaces defining all database records and relations.
- **`schema.json`**: JSON Schema specification for database validation.

---

## 🗄️ Collections & Data Models

1. **`portfolio`**:
   - `netWorth`: Consolidated net worth ($142,850+).
   - `monthlyIncome`: Direct deposit income ($8,200).
   - `monthlyExpenses`: Living costs ($4,650).
   - `monthlySavings`: Savings velocity ($3,550/mo, 43.3% savings rate).
   - `idleChecking`: Unallocated checking balance ($2,690 - $3,140).
   - `healthScore`: Holistic health rating (94/100, Prime Trajectory).

2. **`goals`**:
   - Short-term, medium-term, and long-term milestones (Emergency Cushion, Tokyo Sabbatical, Down Payment, FIRE).
   - Tracks current amount, required velocity, horizon, priority, and account vehicles.

3. **`roadmap`**:
   - Multi-decade milestone timeline across ages 26 to 56.
   - Dynamic deficit detection (e.g. -$24,500 gap on 2031 Home Down Payment).

4. **`scenarios`**:
   - 10,000-run Monte Carlo parameters comparing Baseline Scenario A (retire at 58) vs Lumo AI Scenario B (retire 5 years earlier at age 53).

5. **`transfers`**:
   - Automated capital move ledger (e.g. $450 surplus sweep to index funds).

6. **`chatHistory`**:
   - Multi-turn conversation logs between the user and the Lumo AI Fiduciary Copilot (Gemini 3.8 Flash).
