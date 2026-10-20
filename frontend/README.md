# Lumo Frontend Application

The modern, responsive web application for **Lumo AI Financial Planner**, built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## 🎨 Design System & Features

- **Design System**: Lumo Prime Trajectory (Electric Violet `#532cd8`, Emerald `#006c4e`, Coral `#9d232a`)
- **Typography**: Plus Jakarta Sans & Inter
- **Dark Mode**: Built-in instant theme switcher (Light / Dark) with CSS custom properties
- **Profile & Auth Modal**: Full user management, Google SSO simulation, and account switcher
- **Interactive Views**:
  - **Overview (Home Dashboard)**: Net worth trajectory, cashflow donut, surplus sweep
  - **Goals Manager**: Kanban-style horizon cards with circular SVG completion rings
  - **Life Roadmap**: Dynamic timeline sliders with 2031 Home Gap diagnostics
  - **Scenario Simulator**: 10,000-run Monte Carlo projections comparing Age 53 vs 58
  - **AI Financial Advisor**: Real-time consultation grounded in your balance sheet

---

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

App runs on `http://localhost:5173`.
All `/api` requests are proxied automatically to `http://localhost:3001`.
