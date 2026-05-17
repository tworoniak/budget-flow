import { useState, useCallback, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import { useExpenseStore } from '../app/store/useExpenseStore';
import { downloadCsv } from '../utils/csvExport';
import { useSetTopBarActions } from '../contexts/TopBarActionsContext';
import Drawer from '../components/ui/Drawer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import SummaryCard from '../components/dashboard/SummaryCard';
import CumulativeSpendChart from '../components/dashboard/CumulativeSpendChart';
import BudgetBreakdown from '../components/dashboard/BudgetBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import ForecastBadge from '../components/dashboard/ForecastBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import styles from './DashboardPage.module.scss';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { expenses } = useExpenseStore();
  const data = useDashboardData();
  const setTopBarActions = useSetTopBarActions();

  const now = new Date();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  const remainingPositive = data.remainingBudget >= 0;

  const handleExport = useCallback(() => downloadCsv(expenses), [expenses]);
  const handleAdd = useCallback(() => setIsModalOpen(true), []);

  useEffect(() => {
    setTopBarActions(
      <>
        <button className={styles.exportBtn} onClick={handleExport}>
          <Upload size={14} /> Export
        </button>
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={14} /> Add expense
        </button>
      </>
    );
    return () => setTopBarActions(null);
  }, [setTopBarActions, handleExport, handleAdd]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.greeting}>Hi Alex — here's your money this month</h1>
        <p className={styles.date}>{monthLabel} · {expenses.length} transactions</p>
        <ForecastBadge
          forecastedMonthlySpend={data.forecastedMonthlySpend}
          income={data.income}
        />
      </div>

      <div className={styles.summaryCards}>
        <SummaryCard
          label="Total spent"
          value={`$${data.totalSpent.toFixed(2)}`}
          sub={data.topCategory !== '—' ? `Top: ${data.topCategory}` : undefined}
          sparkData={data.sparklineData}
          sparkColor="#6366f1"
          accent
        />
        <SummaryCard
          label="Remaining budget"
          value={`$${Math.abs(data.remainingBudget).toFixed(2)}`}
          sub={remainingPositive ? 'Within budget' : 'Over budget'}
          subPositive={remainingPositive && data.income > 0}
          subNegative={!remainingPositive}
          sparkData={data.sparklineData}
          sparkColor={remainingPositive ? '#22c55e' : '#ef4444'}
        />
        <SummaryCard
          label="Monthly income"
          value={`$${data.income.toFixed(2)}`}
          sub={data.income === 0 ? 'Set income in Budget' : undefined}
          sparkData={data.sparklineData}
          sparkColor="#8b5cf6"
        />
        <SummaryCard
          label="Savings rate"
          value={`${data.savingsRate.toFixed(1)}%`}
          sub={data.savingsRate > 20 ? 'On track' : data.income > 0 ? 'Review spending' : undefined}
          subPositive={data.savingsRate > 20}
          sparkData={data.sparklineData}
          sparkColor="#f59e0b"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.chartCol}>
          <CumulativeSpendChart
            thisMonthData={data.cumulativeByDay}
            lastMonthData={data.cumulativeLastMonth}
            budgetLimit={data.income}
            forecastLine={data.forecastLine}
          />
        </div>
        <div className={styles.sideCol}>
          <BudgetBreakdown
            categories={data.categories}
            spentByCategory={data.spentByCategory}
          />
        </div>
      </div>

      <div className={styles.bottom}>
        <RecentTransactions transactions={data.recentTransactions} />
        <SpendingByCategory data={data.allSpentByCategory} />
      </div>

      <Drawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add expense"
      >
        <ExpenseForm onClose={() => setIsModalOpen(false)} />
      </Drawer>
    </div>
  );
}
