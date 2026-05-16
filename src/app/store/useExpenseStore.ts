import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from '../../types';

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  importExpenses: (incoming: Expense[]) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      importExpenses: (incoming) =>
        set((state) => {
          const existingIds = new Set(state.expenses.map((e) => e.id));
          const newOnes = incoming.filter((e) => !existingIds.has(e.id));
          return { expenses: [...newOnes, ...state.expenses] };
        }),
    }),
    { name: 'budgetflow-expenses' }
  )
);
