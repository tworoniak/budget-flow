'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { useIncomeStore } from '../../app/store/useIncomeStore';
import type { IncomeSource, IncomeType, IncomeCadence } from '../../types';
import styles from './IncomeSourceForm.module.scss';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Salary', 'Freelance', 'Investments', 'Other']),
  cadence: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually']),
  amount: z.number().positive('Amount must be positive'),
  nextDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TYPE_OPTIONS: IncomeType[] = ['Salary', 'Freelance', 'Investments', 'Other'];
const CADENCE_OPTIONS: { value: IncomeCadence; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

interface Props {
  source?: IncomeSource;
  onClose: () => void;
}

export default function IncomeSourceForm({ source, onClose }: Props) {
  const { addSource, updateSource } = useIncomeStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: source
      ? { name: source.name, type: source.type, cadence: source.cadence, amount: source.amount, nextDate: source.nextDate }
      : { type: 'Salary', cadence: 'monthly' },
  });

  const onSubmit = (data: FormValues) => {
    if (source) {
      updateSource(source.id, { ...data });
    } else {
      addSource({
        id: uuid(),
        name: data.name,
        type: data.type,
        cadence: data.cadence,
        amount: data.amount,
        nextDate: data.nextDate || undefined,
        isActive: true,
      });
    }
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label}>SOURCE NAME</label>
        <input className={styles.input} placeholder="e.g. Acme Co. Payroll" {...register('name')} />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>TYPE</label>
        <div className={styles.typeGrid}>
          {TYPE_OPTIONS.map((t) => (
            <label key={t} className={styles.typeOption}>
              <input type="radio" value={t} {...register('type')} />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {errors.type && <span className={styles.error}>{errors.type.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>AMOUNT</label>
          <div className={styles.amountWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input className={styles.amountInput} type="number" step="0.01" placeholder="0.00" {...register('amount', { valueAsNumber: true })} />
          </div>
          {errors.amount && <span className={styles.error}>{errors.amount.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>CADENCE</label>
          <select className={styles.select} {...register('cadence')}>
            {CADENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>NEXT DATE <span className={styles.optional}>(optional)</span></label>
        <input className={styles.input} type="date" {...register('nextDate')} />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="submit" className={styles.submitBtn}>
          {source ? 'Save changes' : 'Add source'}
        </button>
      </div>
    </form>
  );
}
