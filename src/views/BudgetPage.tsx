'use client'

import { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useBudgetStore } from '../app/store/useBudgetStore';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { calcTotalBudgeted, calcTotalSpent, calcSavingsRate } from '../utils/budgetCalculations';
import { useSetTopBarActions } from '../contexts/TopBarActionsContext';
import Modal from '../components/ui/Modal';
import BudgetSkeleton from '../components/budget/BudgetSkeleton';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetList from '../components/budget/BudgetList';
import type { BudgetCategory } from '../types';
import styles from './BudgetPage.module.scss';

export default function BudgetPage() {
  const { categories, income, isLoading, deleteCategory, setIncome } = useBudgetStore();
  const { expenses } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | undefined>();
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(income.toString());
  const setTopBarActions = useSetTopBarActions();

  const totalBudgeted = calcTotalBudgeted(categories);
  const totalSpent = calcTotalSpent(expenses);
  const unallocated = income - totalBudgeted;
  const savingsRate = calcSavingsRate(income, totalSpent);

  const openAdd = useCallback(() => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  }, []);

  const openEdit = (category: BudgetCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  const handleIncomeSave = () => {
    const parsed = parseFloat(incomeInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setIncome(parsed);
    }
    setIsEditingIncome(false);
  };

  useEffect(() => {
    setTopBarActions(
      <button className={styles.addBtn} onClick={openAdd}>
        <Plus size={14} /> Add category
      </button>
    );
    return () => setTopBarActions(null);
  }, [setTopBarActions, openAdd]);

  const usedCategoryNames = categories.map((c) => c.name);

  if (isLoading) return <BudgetSkeleton />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Budget</h1>
        <p className={styles.subtitle}>
          {categories.length} {categories.length === 1 ? 'category' : 'categories'} tracked
        </p>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Monthly income</span>
          {isEditingIncome ? (
            <div className={styles.incomeEdit}>
              <input
                className={styles.incomeInput}
                type="number"
                min="0"
                step="0.01"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleIncomeSave();
                  if (e.key === 'Escape') setIsEditingIncome(false);
                }}
                autoFocus
              />
              <button className={styles.saveBtn} onClick={handleIncomeSave}>Save</button>
            </div>
          ) : (
            <button className={styles.incomeValue} onClick={() => {
              setIncomeInput(income.toString());
              setIsEditingIncome(true);
            }}>
              ${income.toFixed(2)}
              <span className={styles.editHint}>edit</span>
            </button>
          )}
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total budgeted</span>
          <span className={styles.summaryValue}>${totalBudgeted.toFixed(2)}</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Unallocated</span>
          <span className={`${styles.summaryValue} ${unallocated < 0 ? styles.negative : ''}`}>
            ${Math.abs(unallocated).toFixed(2)}
            {unallocated < 0 && <span className={styles.overTag}>over</span>}
          </span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Savings rate</span>
          <span className={`${styles.summaryValue} ${savingsRate > 0 ? styles.positive : ''}`}>
            {savingsRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <BudgetList
        categories={categories}
        expenses={expenses}
        onEdit={openEdit}
        onDelete={deleteCategory}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit category' : 'Add category'}
      >
        <BudgetForm
          category={editingCategory}
          usedCategoryNames={usedCategoryNames}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
}
