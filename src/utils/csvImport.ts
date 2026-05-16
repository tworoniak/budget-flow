import { z } from 'zod';
import type { Expense } from '../types';

const rowSchema = z.object({
  id: z.string().min(1, 'id is required'),
  title: z.string().min(1, 'title is required'),
  amount: z.string().transform((v, ctx) => {
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'amount must be a positive number' });
      return z.NEVER;
    }
    return n;
  }),
  category: z.string().min(1, 'category is required'),
  date: z.string().min(1, 'date is required'),
  notes: z.string().optional(),
  recurring: z.string().optional().transform((v) => v === 'true'),
});

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

export interface ImportResult {
  valid: Expense[];
  errors: { row: number; message: string }[];
}

export function parseCsv(text: string): ImportResult {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    return { valid: [], errors: [{ row: 0, message: 'File is empty or missing data rows' }] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const expectedHeaders = ['id', 'title', 'amount', 'category', 'date', 'notes', 'recurring'];
  const missingHeaders = expectedHeaders.slice(0, 5).filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      valid: [],
      errors: [{ row: 0, message: `Missing required columns: ${missingHeaders.join(', ')}` }],
    };
  }

  const valid: Expense[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cells = parseCsvLine(line);
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => {
      raw[h] = cells[idx]?.trim() ?? '';
    });

    const result = rowSchema.safeParse({
      id: raw['id'],
      title: raw['title'],
      amount: raw['amount'],
      category: raw['category'],
      date: raw['date'],
      notes: raw['notes'],
      recurring: raw['recurring'],
    });

    if (!result.success) {
      const msg = result.error.issues.map((e) => e.message).join('; ');
      errors.push({ row: i, message: `Row ${i}: ${msg}` });
    } else {
      const d = result.data;
      valid.push({
        id: d.id,
        title: d.title,
        amount: d.amount,
        category: d.category,
        createdAt: d.date,
        notes: d.notes ?? undefined,
        recurring: d.recurring,
      });
    }
  }

  return { valid, errors };
}
