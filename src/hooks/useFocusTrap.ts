import { type RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useFocusTrap<T extends HTMLElement>(ref: RefObject<T | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const el = ref.current;
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

    focusables()[0]?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) { e.preventDefault(); return; }

      if (e.shiftKey) {
        if (document.activeElement === items[0]) {
          e.preventDefault();
          items[items.length - 1].focus();
        }
      } else {
        if (document.activeElement === items[items.length - 1]) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive, ref]);
}
