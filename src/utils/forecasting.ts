export function calcDailyAverage(totalSpent: number, daysElapsed: number): number {
  if (daysElapsed === 0) return 0;
  return totalSpent / daysElapsed;
}

export function calcProjectedMonthly(dailyAvg: number, daysInMonth: number): number {
  return dailyAvg * daysInMonth;
}

export function buildForecastLine(
  cumulativeData: { day: number; amount: number }[],
  daysInMonth: number
): { day: number; forecast: number }[] {
  if (cumulativeData.length === 0) return [];

  const lastPoint = cumulativeData[cumulativeData.length - 1];
  const daysElapsed = lastPoint.day;
  const totalSpent = lastPoint.amount;
  const dailyAvg = calcDailyAverage(totalSpent, daysElapsed);

  const result: { day: number; forecast: number }[] = [];
  for (let d = daysElapsed; d <= daysInMonth; d++) {
    result.push({
      day: d,
      forecast: totalSpent + dailyAvg * (d - daysElapsed),
    });
  }
  return result;
}
