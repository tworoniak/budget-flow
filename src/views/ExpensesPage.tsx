'use client'

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Upload, Plus, Download, SlidersHorizontal } from 'lucide-react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { parseLocalDate } from '../utils/dateUtils';
import { downloadCsv } from '../utils/csvExport';
import { useSetTopBarActions } from '../contexts/TopBarActionsContext';
import { useSetMobileMoreActions } from '../contexts/MobileMoreActionsContext';
import Drawer from '../components/ui/Drawer';
import ImportModal from '../components/ui/ImportModal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseFilters, { type FilterState } from '../components/expenses/ExpenseFilters';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseListGrouped from '../components/expenses/ExpenseListGrouped';
import MobileFilterSheet from '../components/expenses/MobileFilterSheet';
import ExpensesEmptyState from '../components/expenses/ExpensesEmptyState';
import ExpensesSkeleton from '../components/expenses/ExpensesSkeleton';
import ActiveFilterChips from '../components/expenses/ActiveFilterChips';
import ExpenseTabs, { type ExpenseTab } from '../components/expenses/ExpenseTabs';
import SpendingPanel from '../components/expenses/SpendingPanel';
import type { Expense } from '../types';
import styles from './ExpensesPage.module.scss';

function applyTabFilter(expenses: Expense[], tab: ExpenseTab): Expense[] {
  const now = new Date();
  if (tab === 'recurring') return expenses.filter((e) => e.recurring);
  if (tab === 'this-week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return expenses.filter((e) => parseLocalDate(e.createdAt) >= weekAgo);
  }
  if (tab === 'last-month') {
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return expenses.filter((e) => {
      const d = parseLocalDate(e.createdAt);
      return d >= firstOfLastMonth && d <= lastOfLastMonth;
    });
  }
  return expenses;
}

export default function ExpensesPage() {
  const { expenses, isLoading } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [activeTab, setActiveTab] = useState<ExpenseTab>('all');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortDir: 'desc',
  });

  const setTopBarActions = useSetTopBarActions();
  const setMobileMoreActions = useSetMobileMoreActions();

  const tabFiltered = useMemo(() => applyTabFilter(expenses, activeTab), [expenses, activeTab]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.minAmount !== '') count++;
    if (filters.maxAmount !== '') count++;
    if (filters.sortBy !== 'date' || filters.sortDir !== 'desc') count++;
    return count;
  }, [filters]);

  const openAdd = useCallback(() => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  }, []);

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  const handleImport = useCallback(() => setIsImportOpen(true), []);
  const handleExport = useCallback(() => downloadCsv(expenses), [expenses]);

  useEffect(() => {
    setTopBarActions(
      <>
        <button className={styles.secondaryBtn} onClick={handleImport}>
          <Download size={14} /> Import
        </button>
        <button className={styles.secondaryBtn} onClick={handleExport}>
          <Upload size={14} /> Export
        </button>
        <button className={styles.primaryBtn} onClick={openAdd}>
          <Plus size={14} /> New expense
        </button>
      </>
    );
    return () => setTopBarActions(null);
  }, [setTopBarActions, handleImport, handleExport, openAdd]);

  useEffect(() => {
    setMobileMoreActions([
      { icon: <Download size={18} />, label: 'Import CSV', onClick: handleImport },
      { icon: <Upload size={18} />, label: 'Export CSV', onClick: handleExport },
    ]);
    return () => setMobileMoreActions([]);
  }, [setMobileMoreActions, handleImport, handleExport]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Expenses</h1>
        <p className={styles.subtitle}>
          {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} total
        </p>
      </div>

      <div className={styles.toolbar}>
        <ExpenseTabs active={activeTab} onChange={setActiveTab} />
        <div className={styles.desktopFilters}>
          <ExpenseFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Mobile: compact search + filter icon row */}
      <div className={styles.mobileFilterBar}>
        <input
          type="search"
          className={styles.mobileSearch}
          placeholder="Search expenses…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button
          className={`${styles.filterIconBtn} ${activeFilterCount > 0 ? styles.filterActive : ''}`}
          onClick={() => setIsFilterSheetOpen(true)}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
        </button>
      </div>

      <ActiveFilterChips filters={filters} onChange={setFilters} />

      {isLoading ? (
        <ExpensesSkeleton />
      ) : expenses.length === 0 ? (
        <ExpensesEmptyState onAddExpense={openAdd} onImport={handleImport} />
      ) : (
        <div className={styles.body}>
          <div className={styles.listCard}>
            <div className={styles.desktopList}>
              <ExpenseList expenses={tabFiltered} filters={filters} onEdit={openEdit} />
            </div>
            <div className={styles.mobileList}>
              <ExpenseListGrouped expenses={tabFiltered} onEdit={openEdit} />
            </div>
          </div>
          <div className={styles.desktopSidePanel}>
            <SpendingPanel expenses={expenses} />
          </div>
        </div>
      )}

      <MobileFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
      />

      <Drawer
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Edit expense' : 'Add expense'}
        isNew={!editingExpense}
      >
        <ExpenseForm expense={editingExpense} onClose={closeModal} />
      </Drawer>

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
}
