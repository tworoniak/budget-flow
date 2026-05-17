import { Pencil, StopCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Expense } from '../../types';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import { parseLocalDate } from '../../utils/dateUtils';
import { CATEGORY_CONFIG } from '../../constants/categoryConfig';
import styles from './RecurringList.module.scss';

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
    expenses
      .filter((e) => e.recurring && e.title === expense.title && e.category === expense.category)
      .forEach((e) => updateExpense(e.id, { recurring: false }));
    toast.success(`"${expense.title}" set to non-recurring`);
  };

  return (
    <div className={styles.list}>
      {items.map((expense) => {
        const cfg = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG['Other'];
        const Icon = cfg.icon;
        const lastDate = parseLocalDate(expense.createdAt).toLocaleDateString('en-US', {
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
                <Icon size={16} />
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
