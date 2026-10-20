# Lumo AI Financial Planner 2.0

> **Precision Wealth Velocity, Autonomous Multi-Decadal Planning & Grounded AI Intelligence**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Google_Gemini-3.8_Flash-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📁 Repository Structure

This repository is organized into cleanly decoupled folders for frontend, backend, and database:

```
ai-financial-planner-2.0/
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── public/                # Avatars, icons, stitch screen assets
│   ├── src/
│   │   ├── components/        # Overview, Roadmap, Simulator, Goals, AI Advisor, Auth
│   │   ├── services/          # Typed API client connected to backend
│   │   ├── types/             # Shared TypeScript models
│   │   ├── utils/             # Formatters & currency converters
│   │   ├── App.tsx            # Main application layout with Dark Mode
│   │   └── main.tsx           # React DOM entrypoint
│   ├── index.html             # HTML entrypoint
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Lumo design tokens & CSS variables
│   ├── vite.config.ts         # Vite server & backend API proxy
│   └── README.md              # Frontend instructions
│
├── backend/                   # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts           # Express REST API (port 3001)
│   │   ├── gemini.ts          # Google Gemini 3.8 Flash + Telemetry Grounding
│   │   └── db.ts              # Persistent database manager
│   ├── package.json           # Backend dependencies (@google/genai, express, tsx)
│   ├── tsconfig.json          # Backend TypeScript configuration
│   ├── .env.example           # Environment variable template
│   └── README.md              # Backend instructions
│
├── database/                  # Persistence Layer & Data Definitions
│   ├── lumo_database.json     # Live persistent database state
│   ├── seed.json              # Clean seed dataset for fresh setups
│   ├── types.ts               # TypeScript data models for database records
│   ├── schema.json            # JSON Schema specification
│   └── README.md              # Database documentation
│
├── .gitignore
├── package.json               # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/himanshubh987-glitch/ai-financial-planner-2.0-.git
cd ai-financial-planner-2.0-
```

### 2. Run the Full Stack

#### Option A: Run All Together (Recommended)
```bash
# Install root dependencies
npm install

# Run backend and frontend concurrently
npm run dev
```

#### Option B: Run Services Independently

**Terminal 1 — Backend & Database:**
```bash
cd backend
npm install
npm run dev
# Server live on http://localhost:3001
```

**Terminal 2 — Frontend UI:**
```bash
cd frontend
npm install
npm run dev
# App live on http://localhost:5173
```

---

## 🤖 Google Gemini 3.8 Flash AI Copilot

The AI Financial Advisor uses Google's latest **`gemini-3.8-flash`** model through the official `@google/genai` SDK:
- **Telemetry Grounding**: Injects Maya's real-time financial ledger (Net worth $143,300, $3,550/mo savings rate, $2,690 idle checking, -$24,500 down payment gap, and early FIRE projections) directly into the model context.
- **Clean Typography**: Markdown formatting is parsed into native styled typography without raw asterisks (`*`) or corporate fluff.
- **Deterministic Fallback Engine**: If no API key is provided, the built-in quantitative fiduciary engine guarantees 100% continuous uptime.
- **In-App API Key Setup**: Click **"Set Gemini Key"** in the top banner to save your key directly to `.env` and memory.

---

## 🎨 Key Features

1. **Dashboard & Cashflow Radar**:
   - $143,300 net worth tracker with historical and forward projections.
   - One-click surplus sweep ($450 from idle checking into index funds).
   - Spending distribution donut and automated recurring transfer ledger.
2. **Life Roadmap Timeline**:
   - Multi-decade milestone track with interactive simulation sliders.
   - Gap diagnostics for the 2031 Home Down Payment with one-click remedies:
     - **Option A**: Boost monthly savings by +$210/mo.
     - **Option B**: Extend horizon by 8 months to March 2032.
3. **Future Wealth Scenario Simulator**:
   - 10,000-run Monte Carlo probability simulations.
   - Compares Baseline Scenario A (retire at 58) vs AI-Optimized Scenario B (retire 5 years earlier at Age 53).
4. **Goals Planner**:
   - Circular progress gauges across short, medium, and long-term horizons.
5. **Theme & Authentication**:
   - Instant **Dark / Light Mode** switching persisted to `localStorage`.
   - Interactive profile card with user details and **Sign In / Sign Up / Google Auth Modal**.

---

## 📄 License
MIT License. Built for precision financial planning.
