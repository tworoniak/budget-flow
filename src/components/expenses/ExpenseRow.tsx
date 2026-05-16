import type { Expense } from '../../types';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import styles from './ExpenseRow.module.scss';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare: '#22c55e',
  Shopping: '#f97316',
  Utilities: '#06b6d4',
  Other: '#6b7280',
};

export default function ExpenseRow({ expense, onEdit }: ExpenseRowProps) {
  const { deleteExpense } = useExpenseStore();

  const color = CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS['Other'];

  const formattedDate = new Date(expense.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <span className={styles.categoryDot} style={{ backgroundColor: color }} />
        <div className={styles.info}>
          <span className={styles.title}>{expense.title}</span>
          <span className={styles.meta}>
            <span className={styles.category} style={{ color }}>
              {expense.category}
            </span>
            {expense.recurring && <span className={styles.badge}>Recurring</span>}
            <span className={styles.date}>{formattedDate}</span>
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.amount}>${expense.amount.toFixed(2)}</span>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
          >
            ✎
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => deleteExpense(expense.id)}
            aria-label="Delete expense"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
