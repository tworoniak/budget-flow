'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Upload,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import { useIncomeStore } from '../app/store/useIncomeStore';
import { useSetTopBarActions } from '../contexts/TopBarActionsContext';
import { useIncomeData, type PeriodType } from '../hooks/useIncomeData';
import Drawer from '../components/ui/Drawer';
import IncomeSourceForm from '../components/income/IncomeSourceForm';
import IncomeEntryForm from '../components/income/IncomeEntryForm';
import type { IncomeSource, IncomeEntry } from '../types';
import styles from './IncomePage.module.scss';

const TYPE_COLORS: Record<string, string> = {
  Salary: '#6366f1',
  Freelance: '#22c55e',
  Investments: '#f59e0b',
  Other: '#8b8fa8',
};

const CADENCE_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
};

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return `in ${diff} days`;
}

export default function IncomePage() {
  const { sources, entries, deleteSource, deleteEntry } = useIncomeStore();
  const setTopBarActions = useSetTopBarActions();
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [editSource, setEditSource] = useState<IncomeSource | null>(null);
  const [editEntry, setEditEntry] = useState<IncomeEntry | null>(null);
  const [sourceMenuId, setSourceMenuId] = useState<string | null>(null);
  const [entryMenuId, setEntryMenuId] = useState<string | null>(null);

  const data = useIncomeData(period);

  const handleExport = useCallback(() => {
    const rows = [
      ['id', 'title', 'amount', 'date', 'sourceId', 'notes'],
      ...entries.map((e) => [
        e.id,
        e.title,
        String(e.amount),
        e.date,
        e.sourceId ?? '',
        e.notes ?? '',
      ]),
    ];
    const csv =
      '﻿' +
      rows
        .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'income.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  useEffect(() => {
    setTopBarActions(
      <>
        <button className={styles.exportBtn} onClick={handleExport}>
          <Upload size={14} /> Export
        </button>
        <button
          className={styles.addBtn}
          onClick={() => setIsAddEntryOpen(true)}
        >
          <Plus size={14} /> Add income
        </button>
      </>,
    );
    return () => setTopBarActions(null);
  }, [setTopBarActions, handleExport]);

  // Close menus on outside click
  useEffect(() => {
    if (!sourceMenuId && !entryMenuId) return;
    const handler = () => {
      setSourceMenuId(null);
      setEntryMenuId(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [sourceMenuId, entryMenuId]);

  const activeSources = sources.filter((s) => s.isActive);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Income</h1>
          <p className={styles.sub}>
            {activeSources.length} active source
            {activeSources.length !== 1 ? 's' : ''}
            {data.thisMonthTotal > 0 &&
              ` · $${fmt(data.thisMonthTotal)} this month`}
          </p>
        </div>
        <div className={styles.periodToggle}>
          {(['monthly', 'quarterly'] as PeriodType[]).map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.active : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>THIS MONTH</span>
          <span className={styles.cardValue}>${fmt(data.thisMonthTotal)}</span>
          <span className={styles.cardSub}>Current month total</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>YTD INCOME</span>
          <span className={styles.cardValue}>${fmt(data.ytdTotal)}</span>
          <span className={styles.cardSub}>Year to date</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>AVG / MONTH</span>
          <span className={styles.cardValue}>${fmt(data.avgPerMonth)}</span>
          <span className={styles.cardSub}>Trailing average</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>NEXT DEPOSIT</span>
          {data.nextDeposit ? (
            <>
              <div className={styles.nextDepositDate}>
                <Calendar size={14} />
                <span>{fmtDate(data.nextDeposit.source.nextDate!)}</span>
                <span className={styles.nextDepositDays}>
                  {daysUntil(data.nextDeposit.source.nextDate!)}
                </span>
              </div>
              <span className={styles.cardSub}>
                {data.nextDeposit.source.name} · $
                {fmt(data.nextDeposit.source.amount)}
              </span>
            </>
          ) : (
            <span
              className={styles.cardValue}
              style={{ fontSize: '14px', color: 'var(--text-muted)' }}
            >
              —
            </span>
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        {/* Income vs Spending chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Income vs spending</h3>
              <p className={styles.chartSub}>
                Last {period === 'monthly' ? '12 months' : '4 quarters'}
              </p>
            </div>
          </div>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={data.chartData} barGap={2} barCategoryGap='30%'>
              <XAxis
                dataKey='label'
                tick={{ fill: '#5a5a6a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5a5a6a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1e',
                  border: '1px solid #2a2a30',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  `$${fmt(Number(value ?? 0))}`,
                  String(name ?? '')
                    .charAt(0)
                    .toUpperCase() + String(name ?? '').slice(1),
                ]}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey='income' fill='#6366f1' radius={[3, 3, 0, 0]} />
              <Bar dataKey='spending' fill='#7f7f99' radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className={styles.chartLegend}>
            <span>
              <span className={styles.dot} style={{ background: '#6366f1' }} />
              Income
            </span>
            <span>
              <span className={styles.dot} style={{ background: '#2a2a38' }} />
              Spending
            </span>
          </div>
        </div>

        {/* By source donut */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>By source</h3>
              <p className={styles.chartSub}>This month breakdown</p>
            </div>
          </div>
          {data.bySource.length > 0 ? (
            <>
              <ResponsiveContainer width='100%' height={200}>
                <PieChart>
                  <Pie
                    data={data.bySource}
                    dataKey='amount'
                    nameKey='type'
                    cx='50%'
                    cy='50%'
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1e',
                      border: '1px solid #2a2a30',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`$${fmt(Number(value ?? 0))}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.sourceBreakdown}>
                {data.bySource.map(({ type, amount }) => {
                  const pct =
                    data.thisMonthTotal > 0
                      ? Math.round((amount / data.thisMonthTotal) * 100)
                      : 0;
                  return (
                    <div key={type} className={styles.sourceBreakdownRow}>
                      <span
                        className={styles.dot}
                        style={{ background: TYPE_COLORS[type] ?? '#8b8fa8' }}
                      />
                      <span className={styles.sourceBreakdownType}>{type}</span>
                      <span className={styles.sourceBreakdownPct}>{pct}%</span>
                      <span className={styles.sourceBreakdownAmt}>
                        ${fmt(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.emptyChart}>No income logged this month</div>
          )}
        </div>
      </div>

      {/* Income sources table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3 className={styles.tableTitle}>Income sources</h3>
            <p className={styles.tableSub}>
              {activeSources.length} active ·{' '}
              {sources.filter((s) => !s.isActive).length} inactive
            </p>
          </div>
          <button
            className={styles.newSourceBtn}
            onClick={() => setIsAddSourceOpen(true)}
          >
            <Plus size={14} /> New source
          </button>
        </div>
        {sources.length === 0 ? (
          <div className={styles.emptyTable}>
            No income sources yet — add one to get started.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SOURCE</th>
                <th>CADENCE</th>
                <th>NEXT</th>
                <th>AMOUNT</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr
                  key={source.id}
                  className={!source.isActive ? styles.inactiveRow : ''}
                >
                  <td>
                    <div className={styles.sourceName}>
                      <span
                        className={styles.typeTag}
                        style={{
                          background: `${TYPE_COLORS[source.type]}22`,
                          color: TYPE_COLORS[source.type],
                        }}
                      >
                        {source.type}
                      </span>
                      <span>{source.name}</span>
                      {!source.isActive && (
                        <span className={styles.inactiveBadge}>Inactive</span>
                      )}
                    </div>
                  </td>
                  <td>{CADENCE_LABELS[source.cadence]}</td>
                  <td>{source.nextDate ? fmtDate(source.nextDate) : '—'}</td>
                  <td className={styles.amountCell}>+${fmt(source.amount)}</td>
                  <td className={styles.menuCell}>
                    <div className={styles.menuWrapper}>
                      <button
                        className={styles.menuBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSourceMenuId(
                            sourceMenuId === source.id ? null : source.id,
                          );
                        }}
                        aria-label='Source options'
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {sourceMenuId === source.id && (
                        <div
                          className={styles.menu}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setEditSource(source);
                              setSourceMenuId(null);
                            }}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            className={styles.menuDanger}
                            onClick={() => {
                              deleteSource(source.id);
                              setSourceMenuId(null);
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent deposits */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3 className={styles.tableTitle}>Recent deposits</h3>
            <p className={styles.tableSub}>Last 30 days</p>
          </div>
        </div>
        {data.recentEntries.length === 0 ? (
          <div className={styles.emptyTable}>
            No deposits logged in the last 30 days.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>TITLE</th>
                <th>SOURCE</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.recentEntries.map((entry) => {
                const source = sources.find((s) => s.id === entry.sourceId);
                return (
                  <tr key={entry.id}>
                    <td>{entry.title}</td>
                    <td>
                      {source ? (
                        <span
                          className={styles.typeTag}
                          style={{
                            background: `${TYPE_COLORS[source.type]}22`,
                            color: TYPE_COLORS[source.type],
                          }}
                        >
                          {source.type}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{fmtDate(entry.date)}</td>
                    <td className={styles.amountCell}>+${fmt(entry.amount)}</td>
                    <td className={styles.menuCell}>
                      <div className={styles.menuWrapper}>
                        <button
                          className={styles.menuBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEntryMenuId(
                              entryMenuId === entry.id ? null : entry.id,
                            );
                          }}
                          aria-label='Entry options'
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        {entryMenuId === entry.id && (
                          <div
                            className={styles.menu}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setEditEntry(entry);
                                setEntryMenuId(null);
                              }}
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              className={styles.menuDanger}
                              onClick={() => {
                                deleteEntry(entry.id);
                                setEntryMenuId(null);
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawers */}
      <Drawer
        isOpen={isAddEntryOpen}
        onClose={() => setIsAddEntryOpen(false)}
        title='Log deposit'
        isNew
      >
        <IncomeEntryForm onClose={() => setIsAddEntryOpen(false)} />
      </Drawer>

      <Drawer
        isOpen={!!editEntry}
        onClose={() => setEditEntry(null)}
        title='Edit deposit'
      >
        {editEntry && (
          <IncomeEntryForm
            entry={editEntry}
            onClose={() => setEditEntry(null)}
          />
        )}
      </Drawer>

      <Drawer
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        title='Add income source'
        isNew
      >
        <IncomeSourceForm onClose={() => setIsAddSourceOpen(false)} />
      </Drawer>

      <Drawer
        isOpen={!!editSource}
        onClose={() => setEditSource(null)}
        title='Edit income source'
      >
        {editSource && (
          <IncomeSourceForm
            source={editSource}
            onClose={() => setEditSource(null)}
          />
        )}
      </Drawer>
    </div>
  );
}
