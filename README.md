# BudgetFlow

A personal finance dashboard for tracking expenses, managing budgets, and visualizing spending — built as a portfolio-quality React + TypeScript application.

## Features

- **Expense tracking** — add, edit, delete, and search transactions with category color-coding
- **Right-side drawer** — slide-in expense form with category icon grid, large amount input, and tags
- **Budget management** — set monthly income, per-category limits, and track overspend with progress bars
- **Dashboard** — summary cards with sparklines, cumulative spend chart with forecast line, donut chart, and recent transactions
- **CSV import / export** — drag-and-drop CSV import with row validation; export at any time
- **Advanced filtering** — filter by category, date range, and amount; sort by date / amount / title; removable filter chips
- **Recurring expenses** — auto-generate monthly instances; manage subscriptions on a dedicated page
- **Budget forecasting** — daily spend average extrapolated to month-end; on-track / overspend badge on dashboard
- **Command palette** — `Cmd+K` / `Ctrl+K` for keyboard-first navigation and quick actions
- **Page transitions** — fade + slide between routes; animated expense list rows; number counting on summary cards
- **Offline-first** — all data persisted to `localStorage` via Zustand; no backend required

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript (strict) |
| Build | Vite |
| Styling | SCSS Modules |
| State | Zustand + `persist` middleware |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Icons | Lucide React |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build
npm run lint       # ESLint
```

## Project structure

```
src/
├── app/
│   ├── commands/      # command palette command definitions
│   ├── router/        # React Router config
│   └── store/         # Zustand stores (expenses, budget)
├── components/
│   ├── budget/        # BudgetCategoryCard, BudgetForm, BudgetList
│   ├── dashboard/     # SummaryCard, charts, ForecastBadge
│   ├── expenses/      # ExpenseForm, ExpenseList, ExpenseRow, filters
│   ├── layout/        # Sidebar, TopBar
│   ├── recurring/     # RecurringList
│   └── ui/            # Drawer, Modal, CommandPalette, ImportModal
├── contexts/          # TopBarActionsContext
├── hooks/             # useDashboardData, useRecurringCheck, useCommandPalette
├── layouts/           # AppLayout
├── pages/             # DashboardPage, ExpensesPage, BudgetPage, RecurringPage
├── styles/            # SCSS variables, reset, global
├── types/             # Expense, BudgetCategory, etc.
└── utils/             # csvExport, csvImport, dateUtils, budgetCalculations, forecasting
```

## Roadmap

- **Phase 3 (in progress)** — empty/first-run states, mobile layout with bottom tab bar
- **Phase 4** — AI expense categorization, natural language input, smart savings recommendations
- **Phase 5** — authentication, cloud sync, multi-device support
