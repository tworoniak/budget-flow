import { CATEGORIES } from '../../constants/categories';
import styles from './ExpenseFilters.module.scss';

export interface FilterState {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filters, [key]: e.target.value });
  };

  const hasActive = filters.search || filters.category || filters.startDate || filters.endDate;

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
      {hasActive && (
        <button
          className={styles.clearBtn}
          onClick={() => onChange({ search: '', category: '', startDate: '', endDate: '' })}
        >
          Clear
        </button>
      )}
    </div>
  );
}
