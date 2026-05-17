import { Check } from 'lucide-react';
import styles from './SetupChecklist.module.scss';

export interface ChecklistStep {
  label: string;
  complete: boolean;
  description?: string;
}

interface SetupChecklistProps {
  steps: ChecklistStep[];
}

export default function SetupChecklist({ steps }: SetupChecklistProps) {
  const completed = steps.filter((s) => s.complete).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <div className={styles.checklist}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Setup — {completed} of {steps.length}</span>
        <span className={styles.progressPct}>{pct}%</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={i} className={`${styles.step} ${step.complete ? styles.done : ''}`}>
            <span className={styles.stepIcon}>
              {step.complete ? <Check size={11} strokeWidth={3} /> : null}
            </span>
            <div className={styles.stepText}>
              <span className={styles.stepLabel}>{step.label}</span>
              {step.description && (
                <span className={styles.stepDesc}>{step.description}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
