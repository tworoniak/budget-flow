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
