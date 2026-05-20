import { create } from 'zustand';
import { toast } from 'sonner';
import type { Expense } from '../../types';

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  importExpenses: (incoming: Expense[]) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>()((set, get) => ({
  expenses: [],
  isLoading: true,

  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error();
      const data: Expense[] = await res.json();
      set({ expenses: data, isLoading: false });
    } catch {
      toast.error('Failed to load expenses');
      set({ isLoading: false });
    }
  },

  addExpense: (expense) => {
    // Optimistic: add to local state immediately
    set((state) => ({ expenses: [expense, ...state.expenses] }));
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    }).catch(() => {
      set((state) => ({ expenses: state.expenses.filter((e) => e.id !== expense.id) }));
      toast.error('Failed to save expense');
    });
  },

  updateExpense: (id, updates) => {
    const prev = get().expenses.find((e) => e.id === id);
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prev, ...updates }),
    }).catch(() => {
      if (prev) {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? prev : e)),
        }));
      }
      toast.error('Failed to update expense');
    });
  },

  deleteExpense: (id) => {
    const prev = get().expenses.find((e) => e.id === id);
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
    fetch(`/api/expenses/${id}`, { method: 'DELETE' }).catch(() => {
      if (prev) {
        set((state) => ({ expenses: [prev, ...state.expenses] }));
      }
      toast.error('Failed to delete expense');
    });
  },

  importExpenses: async (incoming) => {
    try {
      const res = await fetch('/api/expenses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incoming),
      });
      if (!res.ok) throw new Error();
      const { created } = await res.json();
      // Refresh from DB to get the authoritative list
      await get().fetchExpenses();
      if (created > 0) toast.success(`Imported ${created} expense${created !== 1 ? 's' : ''}`);
    } catch {
      toast.error('Import failed');
    }
  },
}));
