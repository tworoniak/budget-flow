/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';

const DashboardPage = lazy(() => import('../../pages/DashboardPage'));
const ExpensesPage = lazy(() => import('../../pages/ExpensesPage'));
const BudgetPage = lazy(() => import('../../pages/BudgetPage'));
const RecurringPage = lazy(() => import('../../pages/RecurringPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'recurring', element: <RecurringPage /> },
    ],
  },
]);
