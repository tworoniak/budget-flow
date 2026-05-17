import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { Command } from '../../app/commands';
import styles from './CommandPalette.module.scss';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const GROUPS = ['Navigation', 'Actions'] as const;

function filterCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands;
  const q = query.toLowerCase();
  return commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
  );
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const filtered = filterCommands(commands, query);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const cmd = filtered[selectedIndex];
        if (cmd) {
          cmd.action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, selectedIndex, onClose]);

  const grouped = GROUPS.map((g) => ({
    group: g,
    items: filtered.filter((c) => c.group === g),
  })).filter((g) => g.items.length > 0);

  // Build a flat index map so we can track selectedIndex across groups
  const flatItems = grouped.flatMap((g) => g.items);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.inputWrap}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={inputRef}
                className={styles.input}
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className={styles.esc}>Esc</kbd>
            </div>

            <div className={styles.results}>
              {grouped.length === 0 && (
                <div className={styles.empty}>No commands match "{query}"</div>
              )}
              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <div className={styles.groupLabel}>{group}</div>
                  {items.map((cmd) => {
                    const flatIdx = flatItems.indexOf(cmd);
                    const isActive = flatIdx === selectedIndex;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        ref={isActive ? selectedRef : undefined}
                        className={`${styles.item} ${isActive ? styles.active : ''}`}
                        onMouseEnter={() => setSelectedIndex(flatIdx)}
                        onClick={() => { cmd.action(); onClose(); }}
                      >
                        <Icon size={15} className={styles.itemIcon} />
                        <span>{cmd.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> run</span>
              <span><kbd>Esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
