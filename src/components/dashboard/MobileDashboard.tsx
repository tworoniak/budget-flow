import { useDashboardData } from '../../hooks/useDashboardData';
import { useBudgetStore } from '../../app/store/useBudgetStore';
import styles from './MobileDashboard.module.scss';

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

export default function MobileDashboard() {
  const data = useDashboardData();
  const { categories, income } = useBudgetStore();

  const spentPct = income > 0 ? Math.min((data.totalSpent / income) * 100, 100) : 0;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysLeft = daysInMonth - dayOfMonth;

  const remainingPositive = data.remainingBudget >= 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <p className={styles.heroLabel}>Spent this month</p>
        <p className={styles.heroAmount}>${data.totalSpent.toFixed(2)}</p>
        {income > 0 && (
          <p className={styles.heroSub}>
            {spentPct.toFixed(0)}% of ${income.toFixed(0)}
          </p>
        )}
        <p className={`${styles.heroBadge} ${remainingPositive ? styles.badgeGood : styles.badgeBad}`}>
          {remainingPositive
            ? `${daysLeft} days left · ${data.savingsRate.toFixed(0)}% saved`
            : 'Over budget'}
        </p>
      </div>

      <div className={styles.miniStats}>
        <div className={styles.miniCard}>
          <p className={styles.miniLabel}>Budget left</p>
          <p className={`${styles.miniValue} ${remainingPositive ? styles.positive : styles.negative}`}>
            ${Math.abs(data.remainingBudget).toFixed(2)}
          </p>
        </div>
        <div className={styles.miniCard}>
          <p className={styles.miniLabel}>Income</p>
          <p className={styles.miniValue}>${income.toFixed(2)}</p>
        </div>
        <div className={styles.miniCard}>
          <p className={styles.miniLabel}>Saved</p>
          <p className={`${styles.miniValue} ${data.savingsRate > 0 ? styles.positive : ''}`}>
            {data.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className={styles.budgetSection}>
          <p className={styles.sectionTitle}>Budget categories</p>
          <div className={styles.categoryList}>
            {categories.map((cat) => {
              const spent = data.spentByCategory[cat.name] ?? 0;
              const pct = cat.limit > 0 ? Math.min((spent / cat.limit) * 100, 100) : 0;
              const over = spent > cat.limit && cat.limit > 0;
              const color = CATEGORY_COLORS[cat.name] ?? CATEGORY_COLORS['Other'];

              return (
                <div key={cat.id} className={styles.categoryRow}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryDot} style={{ backgroundColor: color }} />
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={`${styles.categorySpent} ${over ? styles.over : ''}`}>
                      ${spent.toFixed(0)} / ${cat.limit.toFixed(0)}
                    </span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={`${styles.progressFill} ${over ? styles.progressOver : ''}`}
                      style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
