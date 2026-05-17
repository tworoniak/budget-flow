import { useNavigate } from 'react-router-dom';
import { Upload, Plus, FileText, Sparkles, BarChart2, Receipt } from 'lucide-react';
import styles from './ExpensesEmptyState.module.scss';

interface ExpensesEmptyStateProps {
  onAddExpense: () => void;
  onImport: () => void;
}

export default function ExpensesEmptyState({ onAddExpense, onImport }: ExpensesEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <div className={styles.receiptBack} />
        <div className={styles.receiptMid} />
        <div className={styles.receiptFront}>
          <Receipt size={24} strokeWidth={1.5} />
        </div>
      </div>

      <h2 className={styles.heading}>Your money story starts here</h2>
      <p className={styles.sub}>
        Start tracking expenses to unlock spending trends, budget health, and monthly forecasts.
      </p>

      <div className={styles.ctas}>
        <button className={styles.secondaryBtn} onClick={onImport}>
          <Upload size={14} /> Import CSV
        </button>
        <button className={styles.primaryBtn} onClick={onAddExpense}>
          <Plus size={14} /> Add expense
        </button>
      </div>

      <div className={styles.tips}>
        <div className={styles.tip}>
          <span className={styles.tipIcon}><FileText size={16} /></span>
          <div className={styles.tipText}>
            <span className={styles.tipTitle}>From a CSV file</span>
            <span className={styles.tipDesc}>Export from your bank and import with one click.</span>
          </div>
        </div>
        <div className={styles.tip}>
          <span className={styles.tipIcon}><Sparkles size={16} /></span>
          <div className={styles.tipText}>
            <span className={styles.tipTitle}>Natural language</span>
            <span className={styles.tipDesc}>Coming in Phase 4 — just describe what you spent.</span>
          </div>
        </div>
        <div className={styles.tip} onClick={() => navigate('/budget')} role="button" tabIndex={0}>
          <span className={styles.tipIcon}><BarChart2 size={16} /></span>
          <div className={styles.tipText}>
            <span className={styles.tipTitle}>Set up budgets</span>
            <span className={styles.tipDesc}>Create category limits so you always know where you stand.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
