import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import type { Expense } from '../../types';
import { CATEGORY_CONFIG } from '../../constants/categoryConfig';
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

const CATEGORY_ORDER = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other'];

const DEFAULT_VALUES = {
  title: '',
  amount: undefined as unknown as number,
  category: '',
  notes: '',
  recurring: false,
  createdAt: new Date().toLocaleDateString('en-CA'),
};

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenseStore();
  const isEditing = !!expense;
  const saveAndNewRef = useRef(false);

  const [tags, setTags] = useState<string[]>(expense?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: DEFAULT_VALUES,
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
      setTags(expense.tags ?? []);
    }
  }, [expense, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedAmount = watch('amount');

  const onSubmit = (data: ExpenseFormData) => {
    const payload = { ...data, tags: tags.length > 0 ? tags : undefined };
    if (isEditing) {
      updateExpense(expense.id, payload);
      toast.success('Expense updated');
    } else {
      addExpense({ id: uuidv4(), ...payload });
      toast.success('Expense added');
    }

    if (saveAndNewRef.current) {
      reset(DEFAULT_VALUES);
      setTags([]);
      setTagInput('');
      saveAndNewRef.current = false;
    } else {
      onClose();
    }
  };

  const addTag = (value: string) => {
    const trimmed = value.trim().replace(/,+$/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* Large amount display */}
      <div className={styles.amountBlock}>
        <span className={styles.currencySymbol}>$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          className={`${styles.amountInput} ${errors.amount ? styles.amountError : ''}`}
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
        />
      </div>
      {errors.amount && (
        <span className={styles.errorMsg} style={{ textAlign: 'center' }}>
          {errors.amount.message}
        </span>
      )}
      {watchedAmount > 0 && (
        <p className={styles.amountHint}>${Number(watchedAmount).toFixed(2)} total</p>
      )}

      {/* Title / Merchant */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Merchant</label>
        <input
          id="title"
          className={`${styles.input} ${errors.title ? styles.error : ''}`}
          placeholder="e.g. Grocery run"
          {...register('title')}
        />
        {errors.title && <span className={styles.errorMsg}>{errors.title.message}</span>}
      </div>

      {/* Category icon grid */}
      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className={`${styles.categoryGrid} ${errors.category ? styles.categoryGridError : ''}`}>
              {CATEGORY_ORDER.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const Icon = cfg.icon;
                const isSelected = field.value === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.categoryBtn} ${isSelected ? styles.categoryBtnActive : ''}`}
                    style={isSelected ? { backgroundColor: cfg.bg, borderColor: cfg.color, color: cfg.color } : undefined}
                    onClick={() => field.onChange(cat)}
                    title={cat}
                  >
                    <Icon size={18} />
                    <span className={styles.categoryBtnLabel}>{cat}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.category && <span className={styles.errorMsg}>{errors.category.message}</span>}
      </div>

      {/* Date */}
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

      {/* Tags */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="tagInput">Tags (optional)</label>
        <div className={styles.tagField}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tagChip}>
              {tag}
              <button type="button" className={styles.tagRemove} onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            id="tagInput"
            className={styles.tagInput}
            placeholder={tags.length === 0 ? 'Add tags…' : ''}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
          />
        </div>
      </div>

      {/* Notes */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="notes">Note (optional)</label>
        <textarea
          id="notes"
          className={styles.textarea}
          placeholder="Any extra detail…"
          rows={2}
          {...register('notes')}
        />
      </div>

      {/* Recurring */}
      <label className={styles.checkboxLabel}>
        <input type="checkbox" className={styles.checkbox} {...register('recurring')} />
        Recurring expense
      </label>

      {/* Footer actions */}
      <div className={styles.actions}>
        {!isEditing && (
          <button
            type="submit"
            className={styles.saveNewBtn}
            onClick={() => { saveAndNewRef.current = true; }}
          >
            Save &amp; new
          </button>
        )}
        <button
          type="submit"
          className={styles.submitBtn}
          onClick={() => { saveAndNewRef.current = false; }}
        >
          {isEditing ? 'Save changes' : 'Save expense'}
        </button>
      </div>
    </form>
  );
}
