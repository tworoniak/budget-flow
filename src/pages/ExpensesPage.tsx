import { useState, useMemo } from 'react';
import { Upload, Plus, Download } from 'lucide-react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { parseLocalDate } from '../utils/dateUtils';
import { downloadCsv } from '../utils/csvExport';
import Modal from '../components/ui/Modal';
import ImportModal from '../components/ui/ImportModal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseFilters, { type FilterState } from '../components/expenses/ExpenseFilters';
import ExpenseList from '../components/expenses/ExpenseList';
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
  const { expenses } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
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

  const tabFiltered = useMemo(() => applyTabFilter(expenses, activeTab), [expenses, activeTab]);

  const openAdd = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>
            {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} total
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.importBtn} onClick={() => setIsImportOpen(true)}>
            <Download size={14} /> Import
          </button>
          <button className={styles.exportBtn} onClick={() => downloadCsv(expenses)}>
            <Upload size={14} /> Export
          </button>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={14} /> New expense
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <ExpenseTabs active={activeTab} onChange={setActiveTab} />
        <ExpenseFilters filters={filters} onChange={setFilters} />
      </div>

      <ActiveFilterChips filters={filters} onChange={setFilters} />

      <div className={styles.body}>
        <div className={styles.listCard}>
          <ExpenseList expenses={tabFiltered} filters={filters} onEdit={openEdit} />
        </div>
        <SpendingPanel expenses={expenses} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Edit expense' : 'Add expense'}
      >
        <ExpenseForm expense={editingExpense} onClose={closeModal} />
      </Modal>

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
}
