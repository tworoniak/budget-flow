import type { Expense } from '../../types';
import type { FilterState } from './ExpenseFilters';
import ExpenseRow from './ExpenseRow';
import styles from './ExpenseList.module.scss';

interface ExpenseListProps {
  expenses: Expense[];
  filters: FilterState;
  onEdit: (expense: Expense) => void;
}

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
    return true;
  });
}

export default function ExpenseList({ expenses, filters, onEdit }: ExpenseListProps) {
  const filtered = applyFilters(expenses, filters);

  if (filtered.length === 0) {
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
      {filtered.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} onEdit={onEdit} />
      ))}
    </div>
  );
}
