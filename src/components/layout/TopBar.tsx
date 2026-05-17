import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './TopBar.module.scss';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/expenses': 'Expenses',
  '/budget': 'Budgets',
  '/recurring': 'Recurring',
};

interface TopBarProps {
  actions: ReactNode;
  onSearchClick: () => void;
}

export default function TopBar({ actions, onSearchClick }: TopBarProps) {
  const { pathname } = useLocation();
  const pageLabel = ROUTE_LABELS[pathname] ?? 'BudgetFlow';

  return (
    <header className={styles.topBar}>
      <div className={styles.breadcrumb}>
        <span className={styles.workspace}>Workspace</span>
        <span className={styles.sep}>/</span>
        <span className={styles.page}>{pageLabel}</span>
      </div>

      <button className={styles.searchBtn} onClick={onSearchClick} aria-label="Search (⌘K)">
        <Search size={13} className={styles.searchIcon} />
        <span className={styles.searchText}>Search transactions, categories...</span>
        <kbd className={styles.kbdHint}>⌘K</kbd>
      </button>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
