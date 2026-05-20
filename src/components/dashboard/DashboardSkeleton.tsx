'use client'

import Skeleton from '../ui/Skeleton';
import styles from './DashboardSkeleton.module.scss';

export default function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Skeleton width="280px" height="28px" />
        <Skeleton width="160px" height="14px" />
      </div>

      {/* Summary cards */}
      <div className={styles.cards}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.card}>
            <Skeleton width="80px" height="12px" />
            <Skeleton width="120px" height="32px" />
            <Skeleton width="100px" height="12px" />
          </div>
        ))}
      </div>

      {/* Chart + side panel */}
      <div className={styles.body}>
        <div className={styles.chartCol}>
          <Skeleton height="220px" borderRadius="12px" />
        </div>
        <div className={styles.sideCol}>
          <Skeleton height="220px" borderRadius="12px" />
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottom}>
        <div className={styles.bottomCard}>
          <Skeleton width="140px" height="16px" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.row}>
              <Skeleton width="60%" height="14px" />
              <Skeleton width="70px" height="14px" />
            </div>
          ))}
        </div>
        <div className={styles.bottomCard}>
          <Skeleton width="140px" height="16px" />
          <div style={{ marginTop: '12px' }}><Skeleton height="160px" borderRadius="50%" /></div>
        </div>
      </div>
    </div>
  );
}
