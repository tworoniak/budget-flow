import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocalStore {
  lastRecurringCheck: string;
  hasSkippedOnboarding: boolean;
  setLastRecurringCheck: (month: string) => void;
  skipOnboarding: () => void;
}

export const useLocalStore = create<LocalStore>()(
  persist(
    (set) => ({
      lastRecurringCheck: '',
      hasSkippedOnboarding: false,
      setLastRecurringCheck: (month) => set({ lastRecurringCheck: month }),
      skipOnboarding: () => set({ hasSkippedOnboarding: true }),
    }),
    { name: 'budgetflow-local' }
  )
);
