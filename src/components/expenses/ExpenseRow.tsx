import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Expense } from '../../types';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import { parseLocalDate } from '../../utils/dateUtils';
import { CATEGORY_CONFIG } from '../../constants/categoryConfig';
import styles from './ExpenseRow.module.scss';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseRow({ expense, onEdit }: ExpenseRowProps) {
  const { deleteExpense } = useExpenseStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = CATEGORY_CONFIG[expense.category] ?? CATEGORY_CONFIG['Other'];
  const Icon = cfg.icon;

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
          <Icon size={16} />
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
        <div className={`${styles.actions} ${confirmDelete ? styles.actionsVisible : ''}`}>
          {confirmDelete ? (
            <>
              <span className={styles.confirmLabel}>Delete?</span>
              <button
                className={`${styles.actionBtn} ${styles.confirmYes}`}
                onClick={() => {
                  deleteExpense(expense.id);
                  toast.success('Expense deleted');
                }}
              >
                Yes
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => setConfirmDelete(false)}
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.actionBtn}
                onClick={() => onEdit(expense)}
                aria-label="Edit expense"
              >
                <Pencil size={13} />
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete expense"
              >
                <X size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
