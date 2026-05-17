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
      <label htmlFor="filter-search" className="sr-only">Search expenses</label>
      <input
        id="filter-search"
        type="search"
        className={styles.search}
        placeholder="Search expenses…"
        value={filters.search}
        onChange={set('search')}
      />
      <label htmlFor="filter-category" className="sr-only">Category</label>
      <select id="filter-category" className={styles.select} value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <label htmlFor="filter-start-date" className="sr-only">From date</label>
      <input
        id="filter-start-date"
        type="date"
        className={styles.date}
        value={filters.startDate}
        onChange={set('startDate')}
      />
      <label htmlFor="filter-end-date" className="sr-only">To date</label>
      <input
        id="filter-end-date"
        type="date"
        className={styles.date}
        value={filters.endDate}
        onChange={set('endDate')}
      />
      <label htmlFor="filter-min-amount" className="sr-only">Minimum amount</label>
      <input
        id="filter-min-amount"
        type="number"
        className={styles.amount}
        placeholder="Min $"
        value={filters.minAmount}
        onChange={set('minAmount')}
        min="0"
        step="0.01"
      />
      <label htmlFor="filter-max-amount" className="sr-only">Maximum amount</label>
      <input
        id="filter-max-amount"
        type="number"
        className={styles.amount}
        placeholder="Max $"
        value={filters.maxAmount}
        onChange={set('maxAmount')}
        min="0"
        step="0.01"
      />
      <div className={styles.sortGroup}>
        <label htmlFor="filter-sort-by" className="sr-only">Sort by</label>
        <select id="filter-sort-by" className={styles.select} value={filters.sortBy} onChange={set('sortBy')}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
        </select>
        <button
          className={styles.sortDirBtn}
          onClick={toggleSortDir}
          aria-label={filters.sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'}
        >
          {filters.sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
