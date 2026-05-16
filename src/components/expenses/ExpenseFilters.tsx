import { CATEGORIES } from '../../constants/categories';
import styles from './ExpenseFilters.module.scss';

export type SortBy = 'date' | 'amount' | 'title';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: SortBy;
  sortDir: SortDir;
}

interface ExpenseFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filters, [key]: e.target.value });
  };

  const toggleSortDir = () => {
    onChange({ ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className={styles.filters}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search expenses…"
        value={filters.search}
        onChange={set('search')}
      />
      <select className={styles.select} value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="date"
        className={styles.date}
        value={filters.startDate}
        onChange={set('startDate')}
        title="From date"
      />
      <input
        type="date"
        className={styles.date}
        value={filters.endDate}
        onChange={set('endDate')}
        title="To date"
      />
      <input
        type="number"
        className={styles.amount}
        placeholder="Min $"
        value={filters.minAmount}
        onChange={set('minAmount')}
        min="0"
        step="0.01"
      />
      <input
        type="number"
        className={styles.amount}
        placeholder="Max $"
        value={filters.maxAmount}
        onChange={set('maxAmount')}
        min="0"
        step="0.01"
      />
      <div className={styles.sortGroup}>
        <select className={styles.select} value={filters.sortBy} onChange={set('sortBy')}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
        </select>
        <button className={styles.sortDirBtn} onClick={toggleSortDir} title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}>
          {filters.sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
