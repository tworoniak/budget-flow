import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import { CATEGORIES } from '../../constants/categories';
import type { Expense } from '../../types';
import styles from './ExpenseForm.module.scss';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
  createdAt: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenseStore();
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: undefined,
      category: '',
      notes: '',
      recurring: false,
      createdAt: new Date().toLocaleDateString('en-CA'),
    },
  });

  useEffect(() => {
    if (expense) {
      reset({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        notes: expense.notes ?? '',
        recurring: expense.recurring ?? false,
        createdAt: expense.createdAt,
      });
    }
  }, [expense, reset]);

  const onSubmit = (data: ExpenseFormData) => {
    if (isEditing) {
      updateExpense(expense.id, data);
    } else {
      addExpense({ id: uuidv4(), ...data });
    }
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          id="title"
          className={`${styles.input} ${errors.title ? styles.error : ''}`}
          placeholder="e.g. Grocery run"
          {...register('title')}
        />
        {errors.title && <span className={styles.errorMsg}>{errors.title.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            className={`${styles.input} ${errors.amount ? styles.error : ''}`}
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && <span className={styles.errorMsg}>{errors.amount.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Category</label>
          <select
            id="category"
            className={`${styles.select} ${errors.category ? styles.error : ''}`}
            {...register('category')}
          >
            <option value="">Select…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className={styles.errorMsg}>{errors.category.message}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="createdAt">Date</label>
        <input
          id="createdAt"
          type="date"
          className={`${styles.input} ${errors.createdAt ? styles.error : ''}`}
          {...register('createdAt')}
        />
        {errors.createdAt && <span className={styles.errorMsg}>{errors.createdAt.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          className={styles.textarea}
          placeholder="Any extra detail…"
          rows={3}
          {...register('notes')}
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input type="checkbox" className={styles.checkbox} {...register('recurring')} />
        Recurring expense
      </label>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {isEditing ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  );
}
