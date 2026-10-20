# Lumo Backend Service

The Node.js + Express backend powering **Lumo AI Financial Planner**, featuring real-time financial ledger persistence and Google Gemini 3.8 Flash (`@google/genai`) AI reasoning.

---

## 🚀 Key Features

1. **Google Gemini 3.8 Flash Integration**:
   - Uses the official `@google/genai` SDK with model `gemini-3.8-flash`.
   - Real-time prompt injection of user's balance sheet, cashflow telemetry, and Monte Carlo runs.
   - Built-in quantitative fallback engine ensuring 100% continuous uptime.
2. **REST API Endpoints**:
   - `GET /api/health`: Health status & Gemini configuration check.
   - `GET /api/portfolio`: Balance sheet, income, expenses, and savings velocity.
   - `POST /api/portfolio/execute-move`: Automates $450 surplus sweep and creates transfer record.
   - `GET /api/goals` & `POST /api/goals`: CRUD for life milestones.
   - `GET /api/roadmap` & `POST /api/roadmap/apply-option`: Multi-decade timeline & deficit remediation.
   - `GET /api/scenarios`: 10,000-run Monte Carlo simulation parameters.
   - `GET /api/transfers`: Transfer ledger.
   - `POST /api/ai/advisor`: Grounded AI advice endpoint.
   - `POST /api/ai/set-key`: Hot-reloading Gemini API Key.
3. **Persistent Database Connector**:
   - Reads and writes to `database/lumo_database.json`.

---

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional)
cp .env.example .env

# 3. Run development server
npm run dev
```

Server runs on `http://localhost:3001` with auto-reload.
