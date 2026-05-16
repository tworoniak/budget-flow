import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './ForecastBadge.module.scss';

interface ForecastBadgeProps {
  forecastedMonthlySpend: number;
  income: number;
}

export default function ForecastBadge({ forecastedMonthlySpend, income }: ForecastBadgeProps) {
  if (forecastedMonthlySpend === 0) return null;

  const isOverBudget = income > 0 && forecastedMonthlySpend > income;
  const overspend = forecastedMonthlySpend - income;

  return (
    <div className={`${styles.badge} ${isOverBudget ? styles.over : styles.onTrack}`}>
      {isOverBudget ? (
        <>
          <TrendingDown size={13} />
          Projected to overspend by ${overspend.toFixed(2)}
        </>
      ) : (
        <>
          <TrendingUp size={13} />
          On track to spend ${forecastedMonthlySpend.toFixed(2)} this month
        </>
      )}
    </div>
  );
}
