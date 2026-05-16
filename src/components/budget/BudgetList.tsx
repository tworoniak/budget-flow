import type { BudgetCategory, Expense } from '../../types';
import { calcSpentByCategory } from '../../utils/budgetCalculations';
import BudgetCategoryCard from './BudgetCategoryCard';
import styles from './BudgetList.module.scss';

interface BudgetListProps {
  categories: BudgetCategory[];
  expenses: Expense[];
  onEdit: (category: BudgetCategory) => void;
  onDelete: (id: string) => void;
}

export default function BudgetList({ categories, expenses, onEdit, onDelete }: BudgetListProps) {
  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No budget categories yet</p>
        <p className={styles.emptySub}>Add a category to start tracking your spending limits.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {categories.map((cat) => (
        <BudgetCategoryCard
          key={cat.id}
          category={cat}
          spent={calcSpentByCategory(expenses, cat.name)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
