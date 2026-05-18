import { useEffect, useId } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
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

interface ParsedValue {
  prefix: string;
  num: number;
  suffix: string;
  decimals: number;
}

function parseValueStr(value: string): ParsedValue | null {
  const dollarMatch = value.match(/^\$(\d+(?:\.\d+)?)$/);
  if (dollarMatch) return { prefix: '$', num: parseFloat(dollarMatch[1]), suffix: '', decimals: 2 };
  const pctMatch = value.match(/^(\d+(?:\.\d+)?)%$/);
  if (pctMatch) return { prefix: '', num: parseFloat(pctMatch[1]), suffix: '%', decimals: 1 };
  return null;
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
  const uid = useId();
  const gradientId = `spark-${uid.replace(/:/g, '')}`;
  const parsed = parseValueStr(value);
  const motionNum = useMotionValue(0);
  const springNum = useSpring(motionNum, { mass: 0.5, stiffness: 100, damping: 18 });
  const displayValue = useTransform(springNum, (n) => {
    if (!parsed) return value;
    return `${parsed.prefix}${n.toFixed(parsed.decimals)}${parsed.suffix}`;
  });

  useEffect(() => {
    if (parsed) motionNum.set(parsed.num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
      <div className={styles.value}>
        {parsed ? <motion.span>{displayValue}</motion.span> : value}
      </div>
      {sparkData && sparkData.length > 0 && (
        <div className={styles.sparkline}>
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="amount"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
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
