import type { BudgetCategory } from '../../types';
import styles from './BudgetBreakdown.module.scss';

interface BudgetBreakdownProps {
  categories: BudgetCategory[];
  spentByCategory: Record<string, number>;
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

export default function BudgetBreakdown({ categories, spentByCategory }: BudgetBreakdownProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Budgets</h2>

      {categories.length === 0 ? (
        <p className={styles.empty}>No budget categories set.</p>
      ) : (
        <div className={styles.list}>
          {categories.map((cat) => {
            const spent = spentByCategory[cat.name] ?? 0;
            const pct = cat.limit > 0 ? Math.min((spent / cat.limit) * 100, 100) : 0;
            const isOver = spent > cat.limit;
            const color = CATEGORY_COLORS[cat.name] ?? '#6b7280';

            return (
              <div key={cat.id} className={styles.row}>
                <div className={styles.rowTop}>
                  <div className={styles.rowLeft}>
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: color }}
                    />
                    <span className={styles.name}>{cat.name}</span>
                  </div>
                  <div className={styles.rowRight}>
                    <span className={isOver ? styles.amountOver : styles.amount}>
                      ${spent.toFixed(0)}
                    </span>
                    <span className={styles.limit}>/ ${cat.limit.toFixed(0)}</span>
                  </div>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isOver ? '#ef4444' : color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
