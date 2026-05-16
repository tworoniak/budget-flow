import type { Expense } from '../../types';
import type { FilterState } from './ExpenseFilters';
import ExpenseRow from './ExpenseRow';
import styles from './ExpenseList.module.scss';

function applyFilters(expenses: Expense[], filters: FilterState): Expense[] {
  return expenses.filter((e) => {
    if (filters.search && !e.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && e.category !== filters.category) {
      return false;
    }
    if (filters.startDate && e.createdAt < filters.startDate) {
      return false;
    }
    if (filters.endDate && e.createdAt > filters.endDate) {
      return false;
    }
    if (filters.minAmount !== '' && e.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount !== '' && e.amount > parseFloat(filters.maxAmount)) {
      return false;
    }
    return true;
  });
}

function applySort(expenses: Expense[], sortBy: FilterState['sortBy'], sortDir: FilterState['sortDir']): Expense[] {
  return [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'amount') {
      cmp = a.amount - b.amount;
    } else if (sortBy === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else {
      cmp = a.createdAt.localeCompare(b.createdAt);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
}

interface ExpenseListProps {
  expenses: Expense[];
  filters: FilterState;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, filters, onEdit }: ExpenseListProps) {
  const filtered = applyFilters(expenses, filters);
  const sorted = applySort(filtered, filters.sortBy, filters.sortDir);

  if (sorted.length === 0) {
    return (
      <div className={styles.empty}>
        {expenses.length === 0
          ? 'No expenses yet. Add your first one.'
          : 'No expenses match your filters.'}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {sorted.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} onEdit={onEdit} />
      ))}
    </div>
  );
}
