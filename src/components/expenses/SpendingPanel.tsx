import { useMemo } from 'react';
import type { Expense } from '../../types';
import { useBudgetStore } from '../../app/store/useBudgetStore';
import styles from './SpendingPanel.module.scss';

interface SpendingPanelProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food:          '#f59e0b',
  Transport:     '#3b82f6',
  Housing:       '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare:    '#22c55e',
  Shopping:      '#f97316',
  Utilities:     '#06b6d4',
  Other:         '#6b7280',
};

function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return expenses.filter((e) => {
    const d = new Date(e.createdAt);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

export default function SpendingPanel({ expenses }: SpendingPanelProps) {
  const { income } = useBudgetStore();

  const monthlyExpenses = useMemo(() => getCurrentMonthExpenses(expenses), [expenses]);
  const totalSpent = useMemo(
    () => monthlyExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthlyExpenses]
  );

  const remaining = income - totalSpent;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayOfMonth = new Date().getDate();
  const expectedSpend = income > 0 ? (income / daysInMonth) * dayOfMonth : 0;
  const daysAhead = income > 0 ? Math.round((expectedSpend - totalSpent) / (income / daysInMonth)) : 0;

  const topExpenses = useMemo(
    () => [...monthlyExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [monthlyExpenses]
  );

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthlyExpenses]);

  return (
    <aside className={styles.panel}>
      <div className={styles.totalBlock}>
        <span className={styles.totalLabel}>Spending so far</span>
        <span className={styles.totalAmount}>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        {income > 0 && (
          <span className={`${styles.trackBadge} ${daysAhead >= 0 ? styles.ahead : styles.behind}`}>
            {daysAhead >= 0 ? `${daysAhead} days ahead` : `${Math.abs(daysAhead)} days behind`}
          </span>
        )}
        {income > 0 && (
          <div className={styles.remainingRow}>
            <span className={styles.remainingLabel}>Remaining</span>
            <span className={`${styles.remainingValue} ${remaining < 0 ? styles.over : ''}`}>
              ${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {remaining < 0 ? ' over' : ''}
            </span>
          </div>
        )}
      </div>

      {topExpenses.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Top transactions</span>
          <div className={styles.list}>
            {topExpenses.map((e) => (
              <div key={e.id} className={styles.listRow}>
                <span className={styles.listTitle}>{e.title}</span>
                <span className={styles.listAmount}>-${e.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {byCategory.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>By category</span>
          <div className={styles.list}>
            {byCategory.map(([cat, total]) => (
              <div key={cat} className={styles.listRow}>
                <div className={styles.catLeft}>
                  <span
                    className={styles.catDot}
                    style={{ backgroundColor: CATEGORY_COLORS[cat] ?? '#6b7280' }}
                  />
                  <span className={styles.listTitle}>{cat}</span>
                </div>
                <span className={styles.listAmount}>-${total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {monthlyExpenses.length === 0 && (
        <p className={styles.empty}>No expenses this month yet.</p>
      )}
    </aside>
  );
}
