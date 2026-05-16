import { X } from 'lucide-react';
import type { FilterState } from './ExpenseFilters';
import styles from './ActiveFilterChips.module.scss';

const EMPTY_FILTERS: FilterState = {
  search: '',
  category: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  sortBy: 'date',
  sortDir: 'desc',
};

interface ActiveFilterChipsProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

interface Chip {
  key: keyof FilterState;
  label: string;
}

export default function ActiveFilterChips({ filters, onChange }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  if (filters.search) chips.push({ key: 'search', label: `"${filters.search}"` });
  if (filters.category) chips.push({ key: 'category', label: filters.category });
  if (filters.startDate) chips.push({ key: 'startDate', label: `From ${filters.startDate}` });
  if (filters.endDate) chips.push({ key: 'endDate', label: `To ${filters.endDate}` });
  if (filters.minAmount !== '') chips.push({ key: 'minAmount', label: `Min $${filters.minAmount}` });
  if (filters.maxAmount !== '') chips.push({ key: 'maxAmount', label: `Max $${filters.maxAmount}` });

  if (chips.length === 0) return null;

  const remove = (key: keyof FilterState) => {
    onChange({ ...filters, [key]: EMPTY_FILTERS[key] });
  };

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <button key={chip.key} className={styles.chip} onClick={() => remove(chip.key)}>
          {chip.label}
          <X size={11} />
        </button>
      ))}
      <button className={styles.clearAll} onClick={() => onChange(EMPTY_FILTERS)}>
        Clear all
      </button>
    </div>
  );
}
