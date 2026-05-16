import { v4 as uuidv4 } from 'uuid';
import type { Expense } from '../types';

export function generateRecurringForMonth(expenses: Expense[], targetMonth: string): Expense[] {
  const recurring = expenses.filter((e) => e.recurring);
  if (recurring.length === 0) return [];

  // Find which (title+category) pairs already have an entry in targetMonth
  const alreadyPresent = new Set<string>();
  for (const e of expenses) {
    if (e.createdAt.startsWith(targetMonth)) {
      alreadyPresent.add(`${e.title}|${e.category}`);
    }
  }

  // For each unique recurring template not yet present this month, generate one
  const seen = new Set<string>();
  const generated: Expense[] = [];

  for (const e of recurring) {
    const key = `${e.title}|${e.category}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!alreadyPresent.has(key)) {
      generated.push({
        id: uuidv4(),
        title: e.title,
        amount: e.amount,
        category: e.category,
        notes: e.notes,
        recurring: true,
        createdAt: `${targetMonth}-01`,
      });
    }
  }

  return generated;
}
