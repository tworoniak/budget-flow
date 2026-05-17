import { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Receipt, Plus, Wallet, MoreHorizontal, RefreshCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MobileMoreAction } from '../../contexts/MobileMoreActionsContext';
import styles from './BottomTabBar.module.scss';

interface BottomTabBarProps {
  onAddExpense: () => void;
  moreActions?: MobileMoreAction[];
}

export default function BottomTabBar({ onAddExpense, moreActions = [] }: BottomTabBarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navigate = useNavigate();

  const handleRecurring = () => {
    setIsMoreOpen(false);
    navigate('/recurring');
  };

  return createPortal(
    <>
      <nav className={styles.bar}>
        <NavLink to="/" end className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
          <Home size={20} />
          <span className={styles.label}>Home</span>
        </NavLink>

        <NavLink to="/expenses" className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
          <Receipt size={20} />
          <span className={styles.label}>Expenses</span>
        </NavLink>

        <button className={styles.fab} onClick={onAddExpense} aria-label="Add expense">
          <Plus size={22} />
        </button>

        <NavLink to="/budget" className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
          <Wallet size={20} />
          <span className={styles.label}>Budgets</span>
        </NavLink>

        <button
          className={`${styles.tab} ${isMoreOpen ? styles.active : ''}`}
          onClick={() => setIsMoreOpen(true)}
        >
          <MoreHorizontal size={20} />
          <span className={styles.label}>More</span>
        </button>
      </nav>

      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              className={styles.sheet}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className={styles.sheetHandle} />
              <div className={styles.sheetHeader}>
                <span className={styles.sheetTitle}>More</span>
                <button className={styles.closeBtn} onClick={() => setIsMoreOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <ul className={styles.sheetList}>
                {moreActions.map((action, i) => (
                  <li key={i}>
                    <button
                      className={styles.sheetItem}
                      onClick={() => { action.onClick(); setIsMoreOpen(false); }}
                    >
                      <span className={styles.sheetIcon}>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  </li>
                ))}
                {moreActions.length > 0 && <li className={styles.sheetDivider} />}
                <li>
                  <button className={styles.sheetItem} onClick={handleRecurring}>
                    <RefreshCcw size={18} className={styles.sheetIcon} />
                    <span>Recurring</span>
                  </button>
                </li>
                <li>
                  <button className={`${styles.sheetItem} ${styles.disabled}`} disabled>
                    <span className={styles.sheetIconPlaceholder} />
                    <span>Analytics</span>
                    <span className={styles.comingSoon}>Soon</span>
                  </button>
                </li>
                <li>
                  <button className={`${styles.sheetItem} ${styles.disabled}`} disabled>
                    <span className={styles.sheetIconPlaceholder} />
                    <span>Settings</span>
                    <span className={styles.comingSoon}>Soon</span>
                  </button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
