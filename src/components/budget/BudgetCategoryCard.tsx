import type { BudgetCategory } from '../../types';
import styles from './BudgetCategoryCard.module.scss';

interface BudgetCategoryCardProps {
  category: BudgetCategory;
  spent: number;
  onEdit: (category: BudgetCategory) => void;
  onDelete: (id: string) => void;
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

export default function BudgetCategoryCard({
  category,
  spent,
  onEdit,
  onDelete,
}: BudgetCategoryCardProps) {
  const cfg = CATEGORY_CONFIG[category.name] ?? CATEGORY_CONFIG['Other'];
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
            {cfg.letter}
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
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={() => onEdit(category)}
              aria-label="Edit budget category"
            >
              ✎
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(category.id)}
              aria-label="Delete budget category"
            >
              ✕
            </button>
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
