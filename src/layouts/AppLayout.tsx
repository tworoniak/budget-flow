import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import CommandPalette from '../components/ui/CommandPalette';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
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
  const { isOpen: isPaletteOpen, close: closePalette } = useCommandPalette();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const commands = useCommands(() => setIsAddExpenseOpen(true));

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
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
      </main>
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} commands={commands} />
      <Modal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="Add expense">
        <ExpenseForm onClose={() => setIsAddExpenseOpen(false)} />
      </Modal>
    </div>
  );
}
