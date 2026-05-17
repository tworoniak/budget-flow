import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import type { BudgetCategory } from '../../types';
import { CATEGORY_CONFIG } from '../../constants/categoryConfig';
import styles from './BudgetCategoryCard.module.scss';

interface BudgetCategoryCardProps {
  category: BudgetCategory;
  spent: number;
  onEdit: (category: BudgetCategory) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCategoryCard({
  category,
  spent,
  onEdit,
  onDelete,
}: BudgetCategoryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = CATEGORY_CONFIG[category.name] ?? CATEGORY_CONFIG['Other'];
  const Icon = cfg.icon;
  const pct = category.limit > 0 ? Math.min((spent / category.limit) * 100, 100) : 0;
  const isOver = spent > category.limit;
  const remaining = category.limit - spent;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div
            className={styles.badge}
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            <Icon size={16} />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{category.name}</span>
            <span className={styles.amounts}>
              <span className={isOver ? styles.spentOver : styles.spent}>
                ${spent.toFixed(2)}
              </span>
              <span className={styles.limit}> / ${category.limit.toFixed(2)}</span>
            </span>
          </div>
        </div>
        <div className={styles.right}>
          {isOver && (
            <span className={styles.overBadge}>
              Over by ${Math.abs(remaining).toFixed(2)}
            </span>
          )}
          {!isOver && (
            <span className={styles.remaining}>${remaining.toFixed(2)} left</span>
          )}
          <div className={`${styles.actions} ${confirmDelete ? styles.actionsVisible : ''}`}>
            {confirmDelete ? (
              <>
                <span className={styles.confirmLabel}>Delete?</span>
                <button
                  className={`${styles.actionBtn} ${styles.confirmYes}`}
                  onClick={() => {
                    onDelete(category.id);
                    toast.success('Budget category deleted');
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
                  onClick={() => onEdit(category)}
                  aria-label="Edit budget category"
                >
                  <Pencil size={13} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Delete budget category"
                >
                  <X size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${isOver ? styles.barOver : ''}`}
          style={{
            width: `${pct}%`,
            backgroundColor: isOver ? '#ef4444' : cfg.color,
          }}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.pct}>{Math.round(pct)}% used</span>
        <span className={styles.limitLabel}>${category.limit.toFixed(0)} limit</span>
      </div>
    </div>
  );
}
