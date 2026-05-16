import { Link } from 'react-router-dom';
import type { Expense } from '../../types';
import styles from './RecentTransactions.module.scss';

interface RecentTransactionsProps {
  transactions: Expense[];
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

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent transactions</h2>
        <Link to="/expenses" className={styles.viewAll}>View all</Link>
      </div>

      {transactions.length === 0 ? (
        <p className={styles.empty}>No transactions yet.</p>
      ) : (
        <div className={styles.list}>
          {transactions.map((tx) => {
            const cfg = CATEGORY_CONFIG[tx.category] ?? CATEGORY_CONFIG['Other'];
            return (
              <div key={tx.id} className={styles.row}>
                <div
                  className={styles.badge}
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.letter}
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{tx.title}</span>
                  <span className={styles.category} style={{ color: cfg.color }}>
                    {tx.category}
                  </span>
                </div>
                <span className={styles.amount}>-${tx.amount.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
