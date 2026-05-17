import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './Drawer.module.scss';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: 'right' | 'bottom';
}

const rightVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
};

const bottomVariants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

export default function Drawer({ isOpen, onClose, title, children, variant = 'right' }: DrawerProps) {
  const isMobile = useIsMobile();
  const effectiveVariant = isMobile ? 'bottom' : variant;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const panelVariants = effectiveVariant === 'bottom' ? bottomVariants : rightVariants;
  const panelClass = effectiveVariant === 'bottom' ? styles.panelBottom : styles.panelRight;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={`${styles.panel} ${panelClass}`}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.headerLabel}>NEW</span>
                <h2 className={styles.title}>{title}</h2>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className={styles.body}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
