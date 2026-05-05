import { useState, useEffect } from 'react';

export type RateHistory = {
  dates: string[];
  values: number[];
};

export type RatePosition = {
  percentile: number; // 0-100
  min: number;
  max: number;
  current: number;
  daysOfData: number;
};

function calculatePosition(values: number[]): RatePosition | null {
  if (values.length < 10) return null;
  const current = values[values.length - 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return null;
  const percentile = ((current - min) / (max - min)) * 100;
  return { percentile, min, max, current, daysOfData: values.length };
}

export type RateData = {
  history: RateHistory;
  current: number;
  dayAgo: number | null;
  weekAgo: number | null;
  monthAgo: number | null;
  dayChange: number | null;
  weekChange: number | null;
  monthChange: number | null;
  position90d: RatePosition | null;
};

function valueAt(values: number[], lookback: number): number | null {
  if (values.length < lookback + 1) return null;
  return values[values.length - 1 - lookback];
}

function pctChange(values: number[], lookback: number): number | null {
  if (values.length < lookback + 1) return null;
  const now = values[values.length - 1];
  const then = values[values.length - 1 - lookback];
  return ((now - then) / then) * 100;
}

export function useExchangeRates(base: string, target: string, days: number) {
  const [data, setData] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (base === target) {
      setData({
        history: { dates: [], values: [] },
        current: 1,
        dayAgo: 1,
        weekAgo: 1,
        monthAgo: 1,
        dayChange: 0,
        weekChange: 0,
        monthChange: 0,
        position90d: null,
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - Math.max(days, 95));
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const url = `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?from=${base}&to=${target}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch rates');
        const json = await res.json();

        const dates = Object.keys(json.rates).sort();
        const values = dates.map((d) => json.rates[d][target]);

        setData({
          history: { dates: dates.slice(-days), values: values.slice(-days) },
          current: values[values.length - 1],
          dayAgo: valueAt(values, 1),
          weekAgo: valueAt(values, 5),
          monthAgo: valueAt(values, 22),
          dayChange: pctChange(values, 1),
          weekChange: pctChange(values, 5),
          monthChange: pctChange(values, 22),
          position90d: calculatePosition(values.slice(-90)),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base, target, days]);

  return { data, loading, error };
}