import { useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import CommandPalette from '../components/ui/CommandPalette';
import Drawer from '../components/ui/Drawer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { TopBarActionsContext } from '../contexts/TopBarActionsContext';
import { useRecurringCheck } from '../hooks/useRecurringCheck';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useCommands } from '../app/commands';
import styles from './AppLayout.module.scss';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AppLayout() {
  useRecurringCheck();
  const location = useLocation();
  const { isOpen: isPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [topBarActions, setTopBarActions] = useState<ReactNode>(null);
  const commands = useCommands(() => setIsAddExpenseOpen(true));

  return (
    <TopBarActionsContext.Provider value={setTopBarActions}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <TopBar actions={topBarActions} onSearchClick={openPalette} />
          <div className={styles.mainContent}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} commands={commands} />
        <Drawer isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="Add expense">
          <ExpenseForm onClose={() => setIsAddExpenseOpen(false)} />
        </Drawer>
      </div>
    </TopBarActionsContext.Provider>
  );
}
