import type { Expense } from '../types';

const HEADERS = ['id', 'title', 'amount', 'category', 'date', 'notes', 'recurring'];

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function expensesToCsv(expenses: Expense[]): string {
  const rows = expenses.map((e) =>
    [
      e.id,
      e.title,
      e.amount.toString(),
      e.category,
      e.createdAt,
      e.notes ?? '',
      e.recurring ? 'true' : 'false',
    ]
      .map(escapeCell)
      .join(',')
  );
  return [HEADERS.join(','), ...rows].join('\n');
}

export function downloadCsv(expenses: Expense[], filename = 'budgetflow-expenses.csv'): void {
  const csv = expensesToCsv(expenses);
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
