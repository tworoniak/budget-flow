'use client'

import Skeleton from '../ui/Skeleton';
import styles from './ExpensesSkeleton.module.scss';

export default function ExpensesSkeleton() {
  return (
    <div className={styles.page}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <Skeleton width="240px" height="32px" />
        <Skeleton width="120px" height="32px" />
        <Skeleton width="120px" height="32px" />
      </div>

      {/* List */}
      <div className={styles.listCard}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width="36px" height="36px" borderRadius="8px" />
            <div className={styles.rowBody}>
              <Skeleton width="55%" height="14px" />
              <Skeleton width="35%" height="12px" />
            </div>
            <Skeleton width="70px" height="16px" />
          </div>
        ))}
      </div>
    </div>
  );
}
