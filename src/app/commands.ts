import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  RefreshCw,
  Plus,
  Upload,
  FilterX,
  type LucideIcon,
} from 'lucide-react';
import { useExpenseStore } from './store/useExpenseStore';
import { downloadCsv } from '../utils/csvExport';

export interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  keywords: string[];
  group: 'Navigation' | 'Actions';
}

export function useCommands(onAddExpense: () => void): Command[] {
  const router = useRouter();
  const { expenses } = useExpenseStore();

  return useMemo(
    () => [
      {
        id: 'nav-dashboard',
        group: 'Navigation' as const,
        label: 'Go to Dashboard',
        icon: LayoutDashboard,
        keywords: ['home', 'overview', 'summary'],
        action: () => router.push('/'),
      },
      {
        id: 'nav-expenses',
        group: 'Navigation' as const,
        label: 'Go to Expenses',
        icon: Receipt,
        keywords: ['expenses', 'transactions', 'spending'],
        action: () => router.push('/expenses'),
      },
      {
        id: 'nav-budget',
        group: 'Navigation' as const,
        label: 'Go to Budget',
        icon: Wallet,
        keywords: ['budget', 'categories', 'limits'],
        action: () => router.push('/budget'),
      },
      {
        id: 'nav-recurring',
        group: 'Navigation' as const,
        label: 'Go to Recurring',
        icon: RefreshCw,
        keywords: ['recurring', 'subscriptions', 'monthly'],
        action: () => router.push('/recurring'),
      },
      {
        id: 'action-add',
        group: 'Actions' as const,
        label: 'Add expense',
        icon: Plus,
        keywords: ['add', 'new', 'create', 'expense'],
        action: onAddExpense,
      },
      {
        id: 'action-export',
        group: 'Actions' as const,
        label: 'Export CSV',
        icon: Upload,
        keywords: ['export', 'download', 'csv'],
        action: () => downloadCsv(expenses),
      },
      {
        id: 'action-clear-filters',
        group: 'Actions' as const,
        label: 'Clear all filters',
        icon: FilterX,
        keywords: ['clear', 'filters', 'reset', 'search'],
        action: () => router.push('/expenses'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, expenses]
  );
}
