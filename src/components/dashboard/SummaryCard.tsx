import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import styles from './SummaryCard.module.scss';

interface SparkPoint {
  day: number;
  amount: number;
}

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean;
  subNegative?: boolean;
  sparkData?: SparkPoint[];
  sparkColor?: string;
  accent?: boolean;
}

export default function SummaryCard({
  label,
  value,
  sub,
  subPositive,
  subNegative,
  sparkData,
  sparkColor = '#6366f1',
  accent,
}: SummaryCardProps) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {sub && (
          <span
            className={`${styles.sub} ${subPositive ? styles.positive : ''} ${subNegative ? styles.negative : ''}`}
          >
            {sub}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {sparkData && sparkData.length > 0 && (
        <div className={styles.sparkline}>
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${sparkColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="amount"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${sparkColor.replace('#', '')})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
