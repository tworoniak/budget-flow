import Drawer from '../ui/Drawer';
import { CATEGORIES } from '../../constants/categories';
import type { FilterState } from './ExpenseFilters';
import styles from './MobileFilterSheet.module.scss';

const DEFAULT_FILTERS: Pick<FilterState, 'category' | 'startDate' | 'endDate' | 'minAmount' | 'maxAmount' | 'sortBy' | 'sortDir'> = {
  category: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  sortBy: 'date',
  sortDir: 'desc',
};

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function MobileFilterSheet({ isOpen, onClose, filters, onChange }: MobileFilterSheetProps) {
  const set = (key: keyof FilterState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => onChange({ ...filters, [key]: e.target.value });

  const toggleSortDir = () =>
    onChange({ ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });

  const clearAll = () => onChange({ ...filters, ...DEFAULT_FILTERS });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filters" variant="bottom">
      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>Category</label>
          <select className={styles.select} value={filters.category} onChange={set('category')}>
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Date range</label>
          <div className={styles.row}>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.startDate}
              onChange={set('startDate')}
              title="From date"
            />
            <input
              type="date"
              className={styles.dateInput}
              value={filters.endDate}
              onChange={set('endDate')}
              title="To date"
            />
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Amount range</label>
          <div className={styles.row}>
            <input
              type="number"
              className={styles.amountInput}
              placeholder="Min $"
              value={filters.minAmount}
              onChange={set('minAmount')}
              min="0"
              step="0.01"
            />
            <input
              type="number"
              className={styles.amountInput}
              placeholder="Max $"
              value={filters.maxAmount}
              onChange={set('maxAmount')}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Sort by</label>
          <div className={styles.row}>
            <select className={`${styles.select} ${styles.grow}`} value={filters.sortBy} onChange={set('sortBy')}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="title">Title</option>
            </select>
            <button className={styles.dirBtn} onClick={toggleSortDir}>
              {filters.sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        <button className={styles.clearBtn} onClick={clearAll}>
          Clear all filters
        </button>
      </div>
    </Drawer>
  );
}
