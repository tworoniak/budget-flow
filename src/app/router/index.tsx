import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import DashboardPage from '../../pages/DashboardPage';
import ExpensesPage from '../../pages/ExpensesPage';
import BudgetPage from '../../pages/BudgetPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'budget', element: <BudgetPage /> },
    ],
  },
]);
