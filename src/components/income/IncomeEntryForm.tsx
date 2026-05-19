'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { useIncomeStore } from '../../app/store/useIncomeStore';
import type { IncomeEntry } from '../../types';
import styles from './IncomeEntryForm.module.scss';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  sourceId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const today = new Date().toISOString().split('T')[0];

interface Props {
  entry?: IncomeEntry;
  onClose: () => void;
}

export default function IncomeEntryForm({ entry, onClose }: Props) {
  const { sources, addEntry, updateEntry } = useIncomeStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: entry
      ? { title: entry.title, amount: entry.amount, date: entry.date, sourceId: entry.sourceId ?? '', notes: entry.notes ?? '' }
      : { date: today, sourceId: '' },
  });

  const onSubmit = (data: FormValues) => {
    if (entry) {
      updateEntry(entry.id, {
        title: data.title,
        amount: data.amount,
        date: data.date,
        sourceId: data.sourceId || undefined,
        notes: data.notes || undefined,
      });
    } else {
      addEntry({
        id: uuid(),
        title: data.title,
        amount: data.amount,
        date: data.date,
        sourceId: data.sourceId || undefined,
        notes: data.notes || undefined,
      });
    }
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.amountBlock}>
        <span className={styles.currencySymbol}>$</span>
        <input
          className={styles.amountInput}
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && <span className={styles.amountError}>{errors.amount.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>TITLE</label>
        <input className={styles.input} placeholder="e.g. Acme Co. payroll" {...register('title')} />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>DATE</label>
          <input className={styles.input} type="date" {...register('date')} />
          {errors.date && <span className={styles.error}>{errors.date.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>SOURCE <span className={styles.optional}>(optional)</span></label>
          <select className={styles.select} {...register('sourceId')}>
            <option value="">No source</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>NOTES <span className={styles.optional}>(optional)</span></label>
        <textarea className={styles.textarea} placeholder="Any additional details..." rows={3} {...register('notes')} />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={styles.submitBtn}>
          {entry ? 'Save changes' : 'Log deposit'}
        </button>
      </div>
    </form>
  );
}
