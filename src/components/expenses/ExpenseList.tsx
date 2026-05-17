import { AnimatePresence, motion } from 'framer-motion';
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
    let cmp: number;
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
      <AnimatePresence initial={false}>
        {sorted.map((expense, index) => (
          <motion.div
            key={expense.id}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: Math.min(index, 5) * 0.04, duration: 0.16, ease: 'easeOut' },
            }}
            exit={{ opacity: 0, x: -16, transition: { duration: 0.14 } }}
          >
            <ExpenseRow expense={expense} onEdit={onEdit} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
