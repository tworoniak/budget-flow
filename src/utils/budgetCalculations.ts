import type { Expense, BudgetCategory } from '../types';

export function calcSpentByCategory(expenses: Expense[], categoryName: string): number {
  return expenses
    .filter((e) => e.category === categoryName)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function calcRemaining(limit: number, spent: number): number {
  return limit - spent;
}

export function calcSavingsRate(income: number, totalSpent: number): number {
  if (income <= 0) return 0;
  return Math.max(0, ((income - totalSpent) / income) * 100);
}

export function calcTotalBudgeted(categories: BudgetCategory[]): number {
  return categories.reduce((sum, c) => sum + c.limit, 0);
}

export function calcTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
