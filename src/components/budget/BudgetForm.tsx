import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useBudgetStore } from '../../app/store/useBudgetStore';
import { CATEGORIES } from '../../constants/categories';
import type { BudgetCategory } from '../../types';
import styles from './BudgetForm.module.scss';

const budgetSchema = z.object({
  name: z.string().min(1, 'Category is required'),
  limit: z.number().positive('Limit must be greater than 0'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  category?: BudgetCategory;
  usedCategoryNames: string[];
  onClose: () => void;
}

export default function BudgetForm({ category, usedCategoryNames, onClose }: BudgetFormProps) {
  const { addCategory, updateCategory } = useBudgetStore();
  const isEdit = !!category;

  const availableCategories = isEdit
    ? CATEGORIES
    : CATEGORIES.filter((c) => !usedCategoryNames.includes(c));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: category?.name ?? '',
      limit: category?.limit ?? undefined,
    },
  });

  const onSubmit = (data: BudgetFormValues) => {
    if (isEdit) {
      updateCategory(category.id, { name: data.name, limit: data.limit });
      toast.success('Budget category updated');
    } else {
      addCategory({ id: uuidv4(), name: data.name, limit: data.limit });
      toast.success('Budget category added');
    }
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="budget-name">
          Category
        </label>
        <select id="budget-name" className={styles.select} {...register('name')}>
          <option value="">Select a category</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="budget-limit">
          Monthly limit ($)
        </label>
        <input
          id="budget-limit"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={styles.input}
          {...register('limit', { valueAsNumber: true })}
        />
        {errors.limit && <span className={styles.error}>{errors.limit.message}</span>}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {isEdit ? 'Save changes' : 'Add category'}
        </button>
      </div>
    </form>
  );
}
