'use client'

import { Suspense, useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import BottomTabBar from '../components/layout/BottomTabBar';
import CommandPalette from '../components/ui/CommandPalette';
import Drawer from '../components/ui/Drawer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { TopBarActionsContext } from '../contexts/TopBarActionsContext';
import { MobileMoreActionsContext, type MobileMoreAction } from '../contexts/MobileMoreActionsContext';
import { useRecurringCheck } from '../hooks/useRecurringCheck';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useCommands } from '../app/commands';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { useBudgetStore } from '../app/store/useBudgetStore';
import styles from './AppLayout.module.scss';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    useExpenseStore.persist.rehydrate();
    useBudgetStore.persist.rehydrate();
  }, []);

  useRecurringCheck();
  const pathname = usePathname();
  const { isOpen: isPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [topBarActions, setTopBarActions] = useState<ReactNode>(null);
  const [mobileMoreActions, setMobileMoreActions] = useState<MobileMoreAction[]>([]);
  const commands = useCommands(() => setIsAddExpenseOpen(true));

  return (
    <MobileMoreActionsContext.Provider value={setMobileMoreActions}>
    <TopBarActionsContext.Provider value={setTopBarActions}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <TopBar actions={topBarActions} onSearchClick={openPalette} />
          <div className={styles.mainContent}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <Suspense fallback={null}>
                  {children}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <BottomTabBar onAddExpense={() => setIsAddExpenseOpen(true)} moreActions={mobileMoreActions} />
        <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} commands={commands} />
        <Drawer isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title="Add expense" isNew>
          <ExpenseForm onClose={() => setIsAddExpenseOpen(false)} />
        </Drawer>
        <Toaster theme="dark" position="top-right" richColors />
      </div>
    </TopBarActionsContext.Provider>
    </MobileMoreActionsContext.Provider>
  );
}
