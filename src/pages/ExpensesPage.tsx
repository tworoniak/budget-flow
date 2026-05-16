import { useState } from 'react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseFilters, { type FilterState } from '../components/expenses/ExpenseFilters';
import ExpenseList from '../components/expenses/ExpenseList';
import type { Expense } from '../types';
import styles from './ExpensesPage.module.scss';

export default function ExpensesPage() {
  const { expenses } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const openAdd = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  const totalShown = expenses.length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>
            {totalShown} {totalShown === 1 ? 'expense' : 'expenses'} total
          </p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          + Add expense
        </button>
      </div>

      <div className={styles.filtersRow}>
        <ExpenseFilters filters={filters} onChange={setFilters} />
      </div>

      <div className={styles.listCard}>
        <ExpenseList expenses={expenses} filters={filters} onEdit={openEdit} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Edit expense' : 'Add expense'}
      >
        <ExpenseForm expense={editingExpense} onClose={closeModal} />
      </Modal>
    </div>
  );
}
