import { Link } from 'react-router-dom';
import type { Expense } from '../../types';
import { CATEGORY_CONFIG } from '../../constants/categoryConfig';
import styles from './RecentTransactions.module.scss';

interface RecentTransactionsProps {
  transactions: Expense[];
}

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
            const Icon = cfg.icon;
            return (
              <div key={tx.id} className={styles.row}>
                <div
                  className={styles.badge}
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  <Icon size={16} />
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
