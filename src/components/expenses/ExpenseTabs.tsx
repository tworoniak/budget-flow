import styles from './ExpenseTabs.module.scss';

export type ExpenseTab = 'all' | 'this-week' | 'last-month' | 'recurring';

const TABS: { id: ExpenseTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'this-week', label: 'This week' },
  { id: 'last-month', label: 'Last month' },
  { id: 'recurring', label: 'Recurring' },
];

interface ExpenseTabsProps {
  active: ExpenseTab;
  onChange: (tab: ExpenseTab) => void;
}

export default function ExpenseTabs({ active, onChange }: ExpenseTabsProps) {
  return (
    <div className={styles.tabs}>
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          className={`${styles.tab} ${active === id ? styles.active : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
