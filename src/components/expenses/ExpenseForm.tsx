import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  UtensilsCrossed, Car, Home, Music, Heart, ShoppingBag, Zap, Tag, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useExpenseStore } from '../../app/store/useExpenseStore';
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

interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

const CATEGORY_ICONS: Record<string, CategoryConfig> = {
  Food:          { icon: UtensilsCrossed, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  Transport:     { icon: Car,             color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  Housing:       { icon: Home,            color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  Entertainment: { icon: Music,           color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  Healthcare:    { icon: Heart,           color: '#22c55e', bg: 'rgba(34,197,94,0.15)'  },
  Shopping:      { icon: ShoppingBag,     color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  Utilities:     { icon: Zap,             color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
  Other:         { icon: Tag,             color: '#6b7280', bg: 'rgba(107,114,128,0.15)'},
};

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

  const watchedAmount = watch('amount');

  const onSubmit = (data: ExpenseFormData) => {
    const payload = { ...data, tags: tags.length > 0 ? tags : undefined };
    if (isEditing) {
      updateExpense(expense.id, payload);
    } else {
      addExpense({ id: uuidv4(), ...payload });
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
                const cfg = CATEGORY_ICONS[cat];
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
