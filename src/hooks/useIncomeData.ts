import { useMemo } from 'react';
import { useIncomeStore } from '../app/store/useIncomeStore';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { parseLocalDate } from '../utils/dateUtils';

export type PeriodType = 'monthly' | 'quarterly';

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getQuarterKey(date: Date) {
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${q}`;
}

const TYPE_COLORS: Record<string, string> = {
  Salary: '#6366f1',
  Freelance: '#22c55e',
  Investments: '#f59e0b',
  Other: '#8b8fa8',
};

export function useIncomeData(period: PeriodType = 'monthly') {
  const { sources, entries } = useIncomeStore();
  const { expenses } = useExpenseStore();

  const now = useMemo(() => new Date(), []);
  const thisMonthKey = getMonthKey(now);
  const thisYear = now.getFullYear();

  const thisMonthTotal = useMemo(() => {
    return entries
      .filter((e) => getMonthKey(parseLocalDate(e.date)) === thisMonthKey)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries, thisMonthKey]);

  const ytdTotal = useMemo(() => {
    return entries
      .filter((e) => parseLocalDate(e.date).getFullYear() === thisYear)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [entries, thisYear]);

  const avgPerMonth = useMemo(() => {
    if (entries.length === 0) return 0;
    const months = new Set(entries.map((e) => getMonthKey(parseLocalDate(e.date))));
    return ytdTotal / Math.max(months.size, 1);
  }, [entries, ytdTotal]);

  const nextDeposit = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = sources
      .filter((s) => s.isActive && s.nextDate)
      .map((s) => ({ source: s, date: parseLocalDate(s.nextDate!) }))
      .filter(({ date }) => date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming[0] ?? null;
  }, [sources]);

  // Income vs spending chart data (last 12 months)
  const chartData = useMemo(() => {
    const result: { label: string; income: number; spending: number }[] = [];

    if (period === 'monthly') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = getMonthKey(d);
        const label = d.toLocaleString('default', { month: 'short' });
        const income = entries
          .filter((e) => getMonthKey(parseLocalDate(e.date)) === key)
          .reduce((s, e) => s + e.amount, 0);
        const spending = expenses
          .filter((e) => getMonthKey(parseLocalDate(e.createdAt)) === key)
          .reduce((s, e) => s + e.amount, 0);
        result.push({ label, income, spending });
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        const quarterMonth = now.getMonth() - i * 3;
        const d = new Date(now.getFullYear(), quarterMonth, 1);
        const key = getQuarterKey(d);
        const label = key.replace('-', ' ');
        const income = entries
          .filter((e) => getQuarterKey(parseLocalDate(e.date)) === key)
          .reduce((s, e) => s + e.amount, 0);
        const spending = expenses
          .filter((e) => getQuarterKey(parseLocalDate(e.createdAt)) === key)
          .reduce((s, e) => s + e.amount, 0);
        result.push({ label, income, spending });
      }
    }

    return result;
  }, [entries, expenses, period, now]); // now is stable (useMemo with [])

  // By source type breakdown (this month)
  const bySource = useMemo(() => {
    const thisMonth = entries.filter(
      (e) => getMonthKey(parseLocalDate(e.date)) === thisMonthKey
    );
    const totals: Record<string, number> = {};
    for (const entry of thisMonth) {
      const source = sources.find((s) => s.id === entry.sourceId);
      const type = source?.type ?? 'Other';
      totals[type] = (totals[type] ?? 0) + entry.amount;
    }
    return Object.entries(totals).map(([type, amount]) => ({
      type,
      amount,
      fill: TYPE_COLORS[type] ?? '#8b8fa8',
    }));
  }, [entries, sources, thisMonthKey]);

  // Recent deposits (last 30 days)
  const recentEntries = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return entries
      .filter((e) => parseLocalDate(e.date) >= cutoff)
      .slice(0, 10);
  }, [entries]);

  return {
    thisMonthTotal,
    ytdTotal,
    avgPerMonth,
    nextDeposit,
    chartData,
    bySource,
    recentEntries,
  };
}
