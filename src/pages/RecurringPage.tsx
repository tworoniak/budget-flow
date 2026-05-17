import { useState } from 'react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import RecurringList from '../components/recurring/RecurringList';
import type { Expense } from '../types';
import styles from './RecurringPage.module.scss';

export default function RecurringPage() {
  const { expenses } = useExpenseStore();
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recurringCount = new Set(
    expenses.filter((e) => e.recurring).map((e) => `${e.title}|${e.category}`)
  ).size;

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recurring</h1>
        <p className={styles.subtitle}>
          {recurringCount} {recurringCount === 1 ? 'subscription' : 'subscriptions'} · auto-generated monthly
        </p>
      </div>

      <div className={styles.card}>
        <RecurringList onEdit={openEdit} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit expense"
      >
        <ExpenseForm expense={editingExpense} onClose={closeModal} />
      </Modal>
    </div>
  );
}
