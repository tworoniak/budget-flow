import { useEffect } from 'react';
import { toast } from 'sonner';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { generateRecurringForMonth } from '../utils/recurringExpenses';

export function useRecurringCheck() {
  const { expenses, lastRecurringCheck, addExpense, setLastRecurringCheck } = useExpenseStore();

  useEffect(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (lastRecurringCheck === thisMonth) return;

    const generated = generateRecurringForMonth(expenses, thisMonth);
    generated.forEach((e) => addExpense(e));
    setLastRecurringCheck(thisMonth);

    if (generated.length > 0) {
      toast.info(`${generated.length} recurring expense${generated.length !== 1 ? 's' : ''} added for this month`);
    }
  // Run once on mount — exhaustive deps would re-trigger on every expense change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
