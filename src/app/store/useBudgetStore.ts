import { create } from 'zustand';
import { toast } from 'sonner';
import type { BudgetCategory } from '../../types';

interface BudgetStore {
  categories: BudgetCategory[];
  income: number;
  isLoading: boolean;
  fetchBudget: () => Promise<void>;
  addCategory: (category: BudgetCategory) => void;
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteCategory: (id: string) => void;
  setIncome: (income: number) => void;
}

export const useBudgetStore = create<BudgetStore>()((set, get) => ({
  categories: [],
  income: 0,
  isLoading: false,

  fetchBudget: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/budget');
      if (!res.ok) throw new Error();
      const data: { income: number; categories: BudgetCategory[] } = await res.json();
      set({ income: data.income, categories: data.categories, isLoading: false });
    } catch {
      toast.error('Failed to load budget');
      set({ isLoading: false });
    }
  },

  setIncome: (income) => {
    const prev = get().income;
    set({ income });
    fetch('/api/budget/income', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income }),
    }).catch(() => {
      set({ income: prev });
      toast.error('Failed to save income');
    });
  },

  addCategory: (category) => {
    set((state) => ({ categories: [...state.categories, category] }));
    fetch('/api/budget/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    }).catch(() => {
      set((state) => ({ categories: state.categories.filter((c) => c.id !== category.id) }));
      toast.error('Failed to save category');
    });
  },

  updateCategory: (id, updates) => {
    const prev = get().categories.find((c) => c.id === id);
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    fetch(`/api/budget/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prev, ...updates }),
    }).catch(() => {
      if (prev) {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? prev : c)),
        }));
      }
      toast.error('Failed to update category');
    });
  },

  deleteCategory: (id) => {
    const prev = get().categories.find((c) => c.id === id);
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
    fetch(`/api/budget/categories/${id}`, { method: 'DELETE' }).catch(() => {
      if (prev) {
        set((state) => ({ categories: [...state.categories, prev] }));
      }
      toast.error('Failed to delete category');
    });
  },
}));
