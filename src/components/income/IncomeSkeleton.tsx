'use client'

import Skeleton from '../ui/Skeleton';
import styles from './IncomeSkeleton.module.scss';

export default function IncomeSkeleton() {
  return (
    <div className={styles.page}>
      {/* Summary cards */}
      <div className={styles.cards}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.card}>
            <Skeleton width="80px" height="12px" />
            <Skeleton width="130px" height="32px" />
            <Skeleton width="100px" height="12px" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <Skeleton width="160px" height="16px" />
          <Skeleton height="220px" borderRadius="8px" />
        </div>
        <div className={styles.chartCard}>
          <Skeleton width="120px" height="16px" />
          <Skeleton height="200px" borderRadius="50%" />
        </div>
      </div>

      {/* Sources table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <Skeleton width="140px" height="16px" />
          <Skeleton width="100px" height="32px" borderRadius="8px" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton width="120px" height="14px" />
            <Skeleton width="80px" height="14px" />
            <Skeleton width="60px" height="14px" />
            <Skeleton width="70px" height="14px" />
          </div>
        ))}
      </div>

      {/* Deposits table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <Skeleton width="140px" height="16px" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <Skeleton width="140px" height="14px" />
            <Skeleton width="80px" height="14px" />
            <Skeleton width="60px" height="14px" />
            <Skeleton width="70px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}
