import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BudgetCategory } from '../../types';

interface BudgetStore {
  categories: BudgetCategory[];
  income: number;
  hasSkippedOnboarding: boolean;
  addCategory: (category: BudgetCategory) => void;
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteCategory: (id: string) => void;
  setIncome: (income: number) => void;
  skipOnboarding: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      categories: [],
      income: 0,
      hasSkippedOnboarding: false,
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      setIncome: (income) => set({ income }),
      skipOnboarding: () => set({ hasSkippedOnboarding: true }),
    }),
    { name: 'budgetflow-budget' }
  )
);
