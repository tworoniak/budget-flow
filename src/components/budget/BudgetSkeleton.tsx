'use client'

import Skeleton from '../ui/Skeleton';
import styles from './BudgetSkeleton.module.scss';

export default function BudgetSkeleton() {
  return (
    <div className={styles.page}>
      {/* Summary row */}
      <div className={styles.summaryRow}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.summaryCard}>
            <Skeleton width="90px" height="12px" />
            <Skeleton width="110px" height="28px" />
          </div>
        ))}
      </div>

      {/* Category cards */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className={styles.categoryCard}>
          <div className={styles.categoryHeader}>
            <Skeleton width="28px" height="28px" borderRadius="6px" />
            <div className={styles.categoryMeta}>
              <Skeleton width="120px" height="14px" />
              <Skeleton width="80px" height="12px" />
            </div>
            <Skeleton width="60px" height="20px" />
          </div>
          <Skeleton height="6px" borderRadius="3px" />
        </div>
      ))}
    </div>
  );
}
