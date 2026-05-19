# BudgetFlow

A personal finance dashboard for tracking expenses, managing budgets, and visualizing income and spending — built as a portfolio-quality full-stack Next.js application.

## Features

- **Authentication** — Google, GitHub, and email/password sign-in via NextAuth v5; custom two-panel auth UI
- **Cloud sync** — all data stored in Neon PostgreSQL per user; no data bleed between accounts
- **Expense tracking** — add, edit, delete, and search transactions with category color-coding and optional tags
- **Right-side drawer** — slide-in expense form with category icon grid, large amount input, and tags
- **Budget management** — set monthly income, per-category limits, and track overspend with progress bars
- **Income page** — income sources (name, type, cadence) + deposit log; Income vs Spending chart, by-source donut, summary cards, and CSV export
- **Dashboard** — summary cards with sparklines, cumulative spend chart with forecast line, donut chart, and recent transactions
- **CSV import / export** — drag-and-drop CSV import with row validation; export at any time
- **Advanced filtering** — filter by category, date range, and amount; sort by date / amount / title; removable filter chips
- **Recurring expenses** — auto-generate monthly instances; manage subscriptions on a dedicated page
- **Budget forecasting** — daily spend average extrapolated to month-end; on-track / overspend badge on dashboard
- **Command palette** — `Cmd+K` / `Ctrl+K` for keyboard-first navigation and quick actions
- **Page transitions** — fade + slide between routes; animated expense list rows; number counting on summary cards
- **Mobile layout** — bottom tab bar, mobile dashboard, date-grouped expense list, bottom-sheet filter panel

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | SCSS Modules |
| State | Zustand (no persist — API-backed) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Auth | NextAuth v5 (Google, GitHub, Credentials) |
| Database | Neon PostgreSQL (Prisma 7) |
| Deployment | Vercel |

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL=           # Neon PostgreSQL connection string
AUTH_SECRET=            # Random secret (openssl rand -base64 32)
AUTH_GOOGLE_ID=         # Google OAuth client ID
AUTH_GOOGLE_SECRET=     # Google OAuth client secret
AUTH_GITHUB_ID=         # GitHub OAuth app ID
AUTH_GITHUB_SECRET=     # GitHub OAuth app secret
```

```bash
npx prisma migrate dev  # apply schema to your database
npm run dev             # http://localhost:3000
```

```bash
npm run build           # production build
npm run lint            # ESLint
```

## Project structure

```
src/
├── app/
│   ├── (app)/         # authenticated route group (AppLayout + SessionProvider)
│   ├── (auth)/        # auth route group (sign-in, register, forgot-password)
│   ├── api/           # route handlers (expenses, budget, income, auth)
│   ├── commands/      # command palette command definitions
│   └── store/         # Zustand stores (expenses, budget, income, local)
├── components/
│   ├── budget/        # BudgetCategoryCard, BudgetForm
│   ├── dashboard/     # SummaryCard, charts, ForecastBadge, DashboardEmptyState
│   ├── expenses/      # ExpenseForm, ExpenseList, ExpenseRow, filters
│   ├── income/        # IncomeSourceForm, IncomeEntryForm
│   ├── layout/        # Sidebar, TopBar, BottomTabBar
│   ├── recurring/     # RecurringList
│   └── ui/            # Drawer, Modal, CommandPalette, ImportModal
├── contexts/          # TopBarActionsContext, MobileMoreActionsContext
├── hooks/             # useDashboardData, useIncomeData, useRecurringCheck, etc.
├── layouts/           # AppLayout
├── lib/               # prisma client, auth config, apiAuth guard
├── styles/            # SCSS variables, reset, global
├── types/             # Expense, BudgetCategory, IncomeSource, IncomeEntry, etc.
├── utils/             # csvExport, csvImport, dateUtils, budgetCalculations, forecasting
└── views/             # DashboardPage, ExpensesPage, BudgetPage, IncomePage, RecurringPage
```

## Roadmap

- **Next** — AI expense categorization, natural language expense entry
- **Later** — offline-first IndexedDB support, Analytics page, shared household budgets
