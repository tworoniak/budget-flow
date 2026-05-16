import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './CumulativeSpendChart.module.scss';

type Period = 'this-month' | 'last-month';

interface DataPoint {
  day: number;
  amount: number;
}

interface CumulativeSpendChartProps {
  thisMonthData: DataPoint[];
  lastMonthData: DataPoint[];
  budgetLimit: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <span>${payload[0].value.toFixed(2)}</span>
      </div>
    );
  }
  return null;
};

export default function CumulativeSpendChart({
  thisMonthData,
  lastMonthData,
  budgetLimit,
}: CumulativeSpendChartProps) {
  const [period, setPeriod] = useState<Period>('this-month');

  const data = period === 'this-month' ? thisMonthData : lastMonthData;
  const total = data[data.length - 1]?.amount ?? 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Cumulative spend</h2>
          <p className={styles.total}>${total.toFixed(2)}</p>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${period === 'this-month' ? styles.active : ''}`}
            onClick={() => setPeriod('this-month')}
          >
            This month
          </button>
          <button
            className={`${styles.tab} ${period === 'last-month' ? styles.active : ''}`}
            onClick={() => setPeriod('last-month')}
          >
            Last month
          </button>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: '#5a5a6a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              tick={{ fill: '#5a5a6a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }} />
            {budgetLimit > 0 && (
              <Area
                type="monotone"
                dataKey="budget"
                stroke="rgba(99,102,241,0.3)"
                strokeDasharray="4 4"
                fill="none"
                dot={false}
                isAnimationActive={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
