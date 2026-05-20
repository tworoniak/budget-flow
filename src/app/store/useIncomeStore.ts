import { create } from 'zustand';
import { toast } from 'sonner';
import type { IncomeSource, IncomeEntry } from '../../types';

interface IncomeStore {
  sources: IncomeSource[];
  entries: IncomeEntry[];
  isLoading: boolean;
  fetchIncome: () => Promise<void>;
  addSource: (source: IncomeSource) => void;
  updateSource: (id: string, updates: Partial<IncomeSource>) => void;
  deleteSource: (id: string) => void;
  addEntry: (entry: IncomeEntry) => void;
  updateEntry: (id: string, updates: Partial<IncomeEntry>) => void;
  deleteEntry: (id: string) => void;
}

export const useIncomeStore = create<IncomeStore>()((set, get) => ({
  sources: [],
  entries: [],
  isLoading: true,

  fetchIncome: async () => {
    set({ isLoading: true });
    try {
      const [sourcesRes, entriesRes] = await Promise.all([
        fetch('/api/income/sources'),
        fetch('/api/income/entries'),
      ]);
      if (!sourcesRes.ok || !entriesRes.ok) throw new Error();
      const [sources, entries] = await Promise.all([sourcesRes.json(), entriesRes.json()]);
      set({ sources, entries, isLoading: false });
    } catch {
      toast.error('Failed to load income data');
      set({ isLoading: false });
    }
  },

  addSource: (source) => {
    set((state) => ({ sources: [...state.sources, source] }));
    fetch('/api/income/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(source),
    }).catch(() => {
      set((state) => ({ sources: state.sources.filter((s) => s.id !== source.id) }));
      toast.error('Failed to save income source');
    });
  },

  updateSource: (id, updates) => {
    const prev = get().sources.find((s) => s.id === id);
    set((state) => ({
      sources: state.sources.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    fetch(`/api/income/sources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prev, ...updates }),
    }).catch(() => {
      if (prev) {
        set((state) => ({
          sources: state.sources.map((s) => (s.id === id ? prev : s)),
        }));
      }
      toast.error('Failed to update income source');
    });
  },

  deleteSource: (id) => {
    const prev = get().sources.find((s) => s.id === id);
    set((state) => ({ sources: state.sources.filter((s) => s.id !== id) }));
    fetch(`/api/income/sources/${id}`, { method: 'DELETE' }).catch(() => {
      if (prev) {
        set((state) => ({ sources: [...state.sources, prev] }));
      }
      toast.error('Failed to delete income source');
    });
  },

  addEntry: (entry) => {
    set((state) => ({ entries: [entry, ...state.entries] }));
    fetch('/api/income/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    }).catch(() => {
      set((state) => ({ entries: state.entries.filter((e) => e.id !== entry.id) }));
      toast.error('Failed to save income entry');
    });
  },

  updateEntry: (id, updates) => {
    const prev = get().entries.find((e) => e.id === id);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    fetch(`/api/income/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prev, ...updates }),
    }).catch(() => {
      if (prev) {
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? prev : e)),
        }));
      }
      toast.error('Failed to update income entry');
    });
  },

  deleteEntry: (id) => {
    const prev = get().entries.find((e) => e.id === id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
    fetch(`/api/income/entries/${id}`, { method: 'DELETE' }).catch(() => {
      if (prev) {
        set((state) => ({ entries: [prev, ...state.entries] }));
      }
      toast.error('Failed to delete income entry');
    });
  },
}));
