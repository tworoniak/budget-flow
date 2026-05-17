import { useNavigate } from 'react-router-dom';
import { Upload, Plus, FileText, BarChart2, Wallet } from 'lucide-react';
import { useBudgetStore } from '../../app/store/useBudgetStore';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import SetupChecklist from '../ui/SetupChecklist';
import styles from './DashboardEmptyState.module.scss';

interface DashboardEmptyStateProps {
  onAddExpense: () => void;
  onImport: () => void;
}

export default function DashboardEmptyState({ onAddExpense, onImport }: DashboardEmptyStateProps) {
  const navigate = useNavigate();
  const { income, categories, hasSkippedOnboarding, skipOnboarding } = useBudgetStore();
  const { expenses } = useExpenseStore();

  const steps = [
    { label: 'Launch BudgetFlow', complete: true, description: 'Welcome aboard' },
    { label: 'Set your monthly income', complete: income > 0, description: 'Add it on the Budget page' },
    { label: 'Add a budget category', complete: categories.length > 0, description: 'Organise your spending' },
    { label: 'Add your first expense', complete: expenses.length > 0 },
    { label: 'Track 5+ expenses', complete: expenses.length >= 5, description: 'Unlock trends and insights' },
  ];

  if (hasSkippedOnboarding) {
    return (
      <div className={styles.minimal}>
        <div className={styles.minimalIcon}>
          <Wallet size={28} strokeWidth={1.5} />
        </div>
        <h3 className={styles.minimalHeading}>Nothing tracked yet</h3>
        <p className={styles.minimalSub}>Add your first expense to unlock insights.</p>
        <div className={styles.minimalCtas}>
          <button className={styles.secondaryBtn} onClick={onImport}>
            <Upload size={14} /> Import CSV
          </button>
          <button className={styles.primaryBtn} onClick={onAddExpense}>
            <Plus size={14} /> Add expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headline}>
        <h2 className={styles.heading}>Welcome to BudgetFlow</h2>
        <p className={styles.sub}>Day 1 — let's get your money set up.</p>
        <div className={styles.headlineCtas}>
          <button className={styles.primaryBtn} onClick={onAddExpense}>
            Get started
          </button>
          <button className={styles.ghostBtn} onClick={skipOnboarding}>
            Skip tour
          </button>
        </div>
      </div>

      <div className={styles.panels}>
        <div className={styles.onboardPanel}>
          <span className={styles.panelLabel}>FIRST-RUN SETUP</span>
          <h3 className={styles.panelHeading}>Clarity for your money, in about 4 minutes.</h3>
          <p className={styles.panelBody}>
            BudgetFlow gives you a real-time picture of where your money goes. Start by adding a
            few expenses — you'll immediately see trends, budget health, and forecasts.
          </p>
          <div className={styles.panelCtas}>
            <button className={styles.secondaryBtn} onClick={onImport}>
              <Upload size={14} /> Import CSV
            </button>
            <button className={styles.primaryBtn} onClick={onAddExpense}>
              <Plus size={14} /> Add expense manually
            </button>
          </div>
        </div>

        <div className={styles.checklistPanel}>
          <SetupChecklist steps={steps} />
        </div>
      </div>

      <div className={styles.cards}>
        <button className={styles.card} onClick={onImport}>
          <FileText size={20} className={styles.cardIcon} />
          <span className={styles.cardTitle}>Import a CSV</span>
          <span className={styles.cardDesc}>Bring in transactions from your bank or another app.</span>
        </button>
        <button className={styles.card} onClick={onAddExpense}>
          <Plus size={20} className={styles.cardIcon} />
          <span className={styles.cardTitle}>Add manually</span>
          <span className={styles.cardDesc}>Log an expense in seconds with the quick-add form.</span>
        </button>
        <button className={styles.card} onClick={() => navigate('/budget')}>
          <BarChart2 size={20} className={styles.cardIcon} />
          <span className={styles.cardTitle}>Set up budgets</span>
          <span className={styles.cardDesc}>Create category limits to track where you're over or under.</span>
        </button>
      </div>
    </div>
  );
}
