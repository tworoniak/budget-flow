import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import styles from './SpendingByCategory.module.scss';

interface CategoryData {
  name: string;
  value: number;
}

interface SpendingByCategoryProps {
  data: CategoryData[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food:          '#f59e0b',
  Transport:     '#3b82f6',
  Housing:       '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare:    '#22c55e',
  Shopping:      '#f97316',
  Utilities:     '#06b6d4',
  Other:         '#6b7280',
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipName}>{payload[0].name}</span>
        <span className={styles.tooltipValue}>${payload[0].value.toFixed(2)}</span>
      </div>
    );
  }
  return null;
};

export default function SpendingByCategory({ data }: SpendingByCategoryProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Where it went</h2>

      {data.length === 0 ? (
        <p className={styles.empty}>No spending data yet.</p>
      ) : (
        <>
          <div className={styles.chart}>
            <PieChart width={240} height={160}>
              <Pie
                data={data}
                cx={120}
                cy={80}
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </div>

          <div className={styles.legend}>
            {data.map((entry) => {
              const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
              const color = CATEGORY_COLORS[entry.name] ?? '#6b7280';
              return (
                <div key={entry.name} className={styles.legendRow}>
                  <span className={styles.legendDot} style={{ backgroundColor: color }} />
                  <span className={styles.legendName}>{entry.name}</span>
                  <span className={styles.legendPct}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
