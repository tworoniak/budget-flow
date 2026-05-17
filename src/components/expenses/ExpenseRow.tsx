import { Pencil, X } from 'lucide-react';
import type { Expense } from '../../types';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import { parseLocalDate } from '../../utils/dateUtils';
import styles from './ExpenseRow.module.scss';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

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

export default function ExpenseRow({ expense, onEdit }: ExpenseRowProps) {
  const { deleteExpense } = useExpenseStore();
  const cfg = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG['Other'];

  const formattedDate = parseLocalDate(expense.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div
          className={styles.iconBadge}
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          {cfg.letter}
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{expense.title}</span>
          <span className={styles.meta}>
            <span className={styles.category} style={{ color: cfg.color }}>
              {expense.category}
            </span>
            {expense.recurring && <span className={styles.tag}>Recurring</span>}
          </span>
        </div>
      </div>

      <div className={styles.center}>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      <div className={styles.right}>
        <span className={styles.amount}>-${expense.amount.toFixed(2)}</span>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
          >
            <Pencil size={13} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => deleteExpense(expense.id)}
            aria-label="Delete expense"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
