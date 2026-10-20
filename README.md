# Lumo AI Financial Planner

> **Precision Wealth Velocity & Autonomous Multi-Decadal Financial Intelligence**

An interactive, responsive full-stack financial planner application built from the Google Stitch project specifications, powered by a persistent database backend and Google Gemini 3.8 Flash (`@google/genai`).

---

## 🌐 Live URLs & Access

- **Public Shareable Link**: [https://6b2f609daaab99.lhr.life](https://6b2f609daaab99.lhr.life)
- **Local Dev Server**: `http://localhost:5173`
- **Backend API & Database**: `http://localhost:3001`
- **Health & Gemini Telemetry**: `http://localhost:3001/api/health`

---

## 🎨 Stitch Project Specifications

- **Project Title**: Lumo AI Financial Planner
- **Project ID**: `8924478439367092514`
- **Design System**: Lumo Prime Trajectory
- **Color Palette**: 
  - Primary (Electric Violet): `#532cd8`
  - Primary Container: `#6c4cf1`
  - Secondary (Emerald / Mint): `#006c4e`
  - Secondary Container: `#5cf9c2`
  - Tertiary (Coral / Alert): `#9d232a`
  - Canvas Surface: `#fcf8ff`
  - High-Contrast Text: `#1b1b25`
- **Typography**: Plus Jakarta Sans (Headlines, Stats & Actions) + Inter (Body & Micro-data)
- **Layout**: Fluid 12-Column Bento Grid + Fixed 72-unit Navigation Sidebar + Top Header Glass Blur

---

## 📱 Downloaded Stitch Screens & Hosted Assets

All screenshot PNGs and source HTML files were downloaded using `curl -L` and are stored in `/stitch_assets/lumo/` and `/public/stitch_screens/lumo/`:

| # | Screen Title | Stitch Screen ID | Resolution | Downloaded Files | Hosted URLs |
|---|--------------|------------------|------------|------------------|-------------|
| **1** | **Lumo - Home Dashboard** | `1debe339a13543c2bbd2825c70cd3445` | 2560 × 3284 | [PNG Screenshot](./stitch_assets/lumo/screen1_dashboard.png)<br/>[HTML Code](./stitch_assets/lumo/screen1_dashboard.html) | [Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WPDaim3w_hqMxHcW9wJNQ_wJdjYJSTPJnmZgn1SOTlo-8UU6AD5Jb0PQIQrXN_aqTzO-E4C-1zWxg718FUhylsW32Zp5VsFF8JFzoohunseDEReqxSXNXvOtyxMfkromcPDwyIlLT9cAwZIHmgb_lD72wqxU-wBIjGMSkgHMsQBMG5F8-4UKoH4Q6YI_C9oCdMhOzZ5K2xbb1vCR2CLe1BamJv1ZSJW-PlzJ1b4ADolJ6IbgO7cxMkvTg)<br/>[HTML Source](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTBiYWEyMDcwMzgzYWRlOTU3MTVjNWE4EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086) |
| **2** | **Lumo - Life Roadmap Timeline** | `3824df3164b5462e9742ca55bfdeadd2` | 2560 × 3452 | [PNG Screenshot](./stitch_assets/lumo/screen2_roadmap.png)<br/>[HTML Code](./stitch_assets/lumo/screen2_roadmap.html) | [Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XrfqB6Xs0lRpdjMMI6IkRgDW8xwzcWPDiufu0ef4xI2nQl8hnED-lppnpOpRy7x66i11wx1nsXVfWhbeWAMQYAIhwJ5Mnppt0Ad69o6sNjOuJ_QUDO7O2Fw7SCT-SZdhIXeyN15XF-9pdo1jEjobBTgCMcuhRT8jQ0K_nKqd9pm4X9rYx6jkk3wYYQ_KbtVoL4lO5uZUKNXw8Nz8GIaWVSfuADWJgtKTJ5DWM8ByNvBtsDG_BNIV63qcU)<br/>[HTML Source](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE2MWU1YzYwOTI1ZDg5ZTQ0M2MxODQ5EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086) |
| **3** | **Lumo - Scenario Simulator** | `7507ec71a66248d4ab9f4bd0f67ea25d` | 2560 × 4686 | [PNG Screenshot](./stitch_assets/lumo/screen3_simulator.png)<br/>[HTML Code](./stitch_assets/lumo/screen3_simulator.html) | [Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1Xcc0NHyTZem7rcEIb48KrRn1nrJO5rpxDif0PttE6iQVQ2QSkuo1ppFzPRUuXoaEAiIef5DDtfOPvpFn7jBhVvyzUVZsx3fWMoPKaSZh96S5bbA02kRwS-DKHOs2-r1JW6arKwgokPUAwo-0UK6iNoxQ43w-to4sXYcdTcbI41UrrYR7MIbGE99peaHhJdoatimMCIQlOFFiRuZpv8y20gDUdAbu5QTFrB5_VTTjXk_L2c6DuYZyAWbPo)<br/>[HTML Source](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE4NDQ0NTkwOTEwNGZjYzMzMGJjMjBmEgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086) |
| **4** | **Lumo - Goals Manager** | `91d638c3451945b49052f5b103c5efb9` | 2560 × 2868 | [PNG Screenshot](./stitch_assets/lumo/screen4_goals.png)<br/>[HTML Code](./stitch_assets/lumo/screen4_goals.html) | [Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1UX9cS4YDXcWPln5G_qhU3PwqyrMrIPIviVh8nbeRTUZaDX2CCeWFPqWYgLhCrMSf792yrlJadvDpzOVynrT24GcgNkuYXrSBTlPDSkf-32rof_jacYQ_MJdcktCGaicsh3YDn-B8uRqU6Wnd7hL9DxA-VlCXM0EA11pMxtrruszIYy9p-G0cK4Ooh-nZ07hhIsOYXHc7K-F838v9DnzKdvx5GYVgl5BaDYKd4w9okAB1dsjpqkqTMYxNs)<br/>[HTML Source](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZTQ0OTE5MDhhMzcwNzNhZjEzOWVjMzc2NjA0EgsSBxChw8DX1wUYAZIBIwoKcHJvamVjdF9pZBIVQhM4OTI0NDc4NDM5MzY3MDkyNTE0&filename=&opi=89354086) |

---

## 🚀 Full-Stack Architecture & Database

```
projects/
├── server/
│   ├── index.ts               # Express REST API (port 3001)
│   ├── db.ts                  # Persistent Atomic JSON Database Engine
│   ├── gemini.ts              # Gemini 3.8 Flash (@google/genai) + Telemetry Grounding
│   └── data/
│       └── lumo_database.json # Live persisted database file
├── src/
│   ├── components/            # UI Views (Dashboard, Roadmap, Simulator, Goals, AI Advisor)
│   ├── services/
│   │   └── api.ts             # Typed REST Client hooking UI to Express backend
│   └── types/
│       └── lifepath.ts        # Shared TypeScript interfaces
├── vite.config.ts             # Vite proxy (/api -> http://localhost:3001)
└── package.json
```

### Persistent REST Endpoints

- `GET /api/health`: Health status & Gemini configuration check.
- `GET /api/portfolio`: Current net worth, cashflow, and surplus metrics.
- `POST /api/portfolio/execute-move`: Automates $450 surplus sweep, updates idle checking & transfers.
- `GET /api/goals` & `POST /api/goals`: CRUD for life milestones.
- `GET /api/roadmap` & `POST /api/roadmap/apply-option`: Multi-decade roadmap & deficit resolution.
- `GET /api/scenarios` & `PUT /api/scenarios`: 10,000-run Monte Carlo scenario inputs.
- `GET /api/transfers` & `POST /api/transfers`: Automated transfer ledger.
- `POST /api/ai/advisor`: Grounded fiduciary reasoning with Google Gemini 3.8 Flash.
- `POST /api/ai/set-key`: Save and hot-reload `GEMINI_API_KEY` in `.env` and memory.

---

## 🤖 Google Gemini 3.8 Flash AI Advisor

The **Lumo AI Financial Advisor** uses Google's latest `gemini-3.8-flash` model via the official `@google/genai` SDK:
- Grounded in real-time user database telemetry (Net Worth $142,850+, Savings $3,550/mo, Idle Checking, 2031 Home Down Payment -$24,500 gap, and early FIRE projections).
- Incorporates a local **deterministic quantitative fallback engine** to ensure 100% continuous uptime.
- In-UI Key Setup modal allowing one-click configuration of `GEMINI_API_KEY`.

---

## 🛠️ Local Development & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create `.env` file or use the in-app Gemini Key dialog:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Backend & Frontend
```bash
# Terminal 1: Backend server
npm run server

# Terminal 2: Vite dev server
npm run dev
```

Visit `http://localhost:5173` or your public tunnel link!
