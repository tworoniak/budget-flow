import { useMemo } from 'react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { useBudgetStore } from '../app/store/useBudgetStore';
import { calcSpentByCategory, calcSavingsRate } from '../utils/budgetCalculations';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function useDashboardData() {
  const { expenses } = useExpenseStore();
  const { categories, income } = useBudgetStore();

  return useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const thisMonthExpenses = expenses.filter(
      (e) => new Date(e.createdAt) >= monthStart
    );

    const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = income - totalSpent;
    const savingsRate = calcSavingsRate(income, totalSpent);

    const spentByCategory: Record<string, number> = {};
    for (const cat of categories) {
      spentByCategory[cat.name] = calcSpentByCategory(thisMonthExpenses, cat.name);
    }
    const topCategoryEntry = Object.entries(spentByCategory)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])[0];
    const topCategory = topCategoryEntry?.[0] ?? '—';

    // Cumulative spend by day for current month
    const daysInMonth = now.getDate();
    const cumulativeByDay: { day: number; amount: number }[] = [];
    let running = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), d);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), d + 1);
      const dayTotal = thisMonthExpenses
        .filter((e) => {
          const t = new Date(e.createdAt);
          return t >= dayStart && t < dayEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      running += dayTotal;
      cumulativeByDay.push({ day: d, amount: running });
    }

    // Last 7 days daily spend (for sparklines)
    const sparklineData: { day: number; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = startOfDay(d);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const dayTotal = expenses
        .filter((e) => {
          const t = new Date(e.createdAt);
          return t >= dayStart && t < dayEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      sparklineData.push({ day: 7 - i, amount: dayTotal });
    }

    // Cumulative spend by day for last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthExpenses = expenses.filter((e) => {
      const t = new Date(e.createdAt);
      return t >= lastMonthStart && t <= lastMonthEnd;
    });
    const daysInLastMonth = lastMonthEnd.getDate();
    const cumulativeLastMonth: { day: number; amount: number }[] = [];
    let runningLast = 0;
    for (let d = 1; d <= daysInLastMonth; d++) {
      const dayStart = new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), d);
      const dayEnd = new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), d + 1);
      const dayTotal = lastMonthExpenses
        .filter((e) => {
          const t = new Date(e.createdAt);
          return t >= dayStart && t < dayEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      runningLast += dayTotal;
      cumulativeLastMonth.push({ day: d, amount: runningLast });
    }

    // Category breakdown for pie chart (all-time)
    const allSpentByCategory = categories.map((cat) => ({
      name: cat.name,
      value: calcSpentByCategory(expenses, cat.name),
    })).filter((c) => c.value > 0);

    const recentTransactions = [...expenses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalSpent,
      remainingBudget,
      savingsRate,
      topCategory,
      income,
      cumulativeByDay,
      cumulativeLastMonth,
      sparklineData,
      allSpentByCategory,
      recentTransactions,
      categories,
      spentByCategory,
      thisMonthExpenses,
    };
  }, [expenses, categories, income]);
}
