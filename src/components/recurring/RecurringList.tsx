import { Pencil, StopCircle, RefreshCw } from 'lucide-react';
import type { Expense } from '../../types';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import styles from './RecurringList.module.scss';

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; letter: string }> = {
  Food:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  letter: 'F' },
  Transport:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  letter: 'T' },
  Housing:       { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  letter: 'H' },
  Entertainment: { color: '#ec4899', bg: 'rgba(236,72,153,0.12)',  letter: 'E' },
  Healthcare:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   letter: 'HC' },
  Shopping:      { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  letter: 'S' },
  Utilities:     { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   letter: 'U' },
  Other:         { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', letter: 'O' },
};

interface RecurringListProps {
  onEdit: (expense: Expense) => void;
}

export default function RecurringList({ onEdit }: RecurringListProps) {
  const { expenses, updateExpense } = useExpenseStore();

  // Dedupe by title+category — show the most recent instance as the representative
  const recurringMap = new Map<string, Expense>();
  for (const e of expenses) {
    if (!e.recurring) continue;
    const key = `${e.title}|${e.category}`;
    const existing = recurringMap.get(key);
    if (!existing || e.createdAt > existing.createdAt) {
      recurringMap.set(key, e);
    }
  }

  const items = Array.from(recurringMap.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <RefreshCw size={32} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>No recurring expenses</p>
        <p className={styles.emptySub}>Mark an expense as recurring when adding or editing it.</p>
      </div>
    );
  }

  const stopRecurring = (expense: Expense) => {
    // Remove recurring flag from ALL instances with same title+category
    expenses
      .filter((e) => e.recurring && e.title === expense.title && e.category === expense.category)
      .forEach((e) => updateExpense(e.id, { recurring: false }));
  };

  return (
    <div className={styles.list}>
      {items.map((expense) => {
        const cfg = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG['Other'];
        const lastDate = new Date(expense.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <div key={`${expense.title}|${expense.category}`} className={styles.row}>
            <div className={styles.left}>
              <div
                className={styles.iconBadge}
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.letter}
              </div>
              <div className={styles.info}>
                <span className={styles.title}>{expense.title}</span>
                <span className={styles.category} style={{ color: cfg.color }}>
                  {expense.category}
                </span>
              </div>
            </div>

            <div className={styles.meta}>
              <span className={styles.frequency}>Monthly</span>
              <span className={styles.lastDate}>Last: {lastDate}</span>
            </div>

            <div className={styles.right}>
              <span className={styles.amount}>${expense.amount.toFixed(2)}<span className={styles.period}>/mo</span></span>
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => onEdit(expense)}
                  aria-label="Edit expense"
                >
                  <Pencil size={13} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.stopBtn}`}
                  onClick={() => stopRecurring(expense)}
                  aria-label="Stop recurring"
                  title="Stop recurring"
                >
                  <StopCircle size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
