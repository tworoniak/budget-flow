import { useMemo } from 'react';
import { parseLocalDate } from '../../utils/dateUtils';
import ExpenseRow from './ExpenseRow';
import type { Expense } from '../../types';
import styles from './ExpenseListGrouped.module.scss';

interface ExpenseListGroupedProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

function formatDateHeader(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (isToday) return `TODAY · ${shortDate}`;
  if (isYesterday) return `YESTERDAY · ${shortDate}`;
  return shortDate.toUpperCase();
}

export default function ExpenseListGrouped({ expenses, onEdit }: ExpenseListGroupedProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const expense of expenses) {
      const key = expense.createdAt.slice(0, 10);
      const group = map.get(key);
      if (group) {
        group.push(expense);
      } else {
        map.set(key, [expense]);
      }
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No transactions match your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {grouped.map(([dateKey, group]) => (
        <div key={dateKey} className={styles.group}>
          <div className={styles.dateHeader}>{formatDateHeader(dateKey)}</div>
          {group.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} onEdit={onEdit} />
          ))}
        </div>
      ))}
    </div>
  );
}
