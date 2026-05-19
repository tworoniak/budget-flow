export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  recurring?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
}

export interface MonthlyBudget {
  id: string;
  income: number;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  month: string;
}

export interface DashboardSummary {
  totalSpent: number;
  remainingBudget: number;
  savingsRate: number;
  topCategory: string;
}

export type IncomeType = 'Salary' | 'Freelance' | 'Investments' | 'Other';
export type IncomeCadence = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';

export interface IncomeSource {
  id: string;
  name: string;
  type: IncomeType;
  cadence: IncomeCadence;
  amount: number;
  nextDate?: string;
  isActive: boolean;
}

export interface IncomeEntry {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  sourceId?: string;
}
