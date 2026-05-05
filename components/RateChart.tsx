'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Props = {
  dates: string[];
  values: number[];
  base: string;
  target: string;
};

export function RateChart({ dates, values, base, target }: Props) {
  const data = dates.map((date, i) => ({ date, rate: values[i] }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(d) => d.slice(5)}
          minTickGap={40}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          domain={['auto', 'auto']}
          tickFormatter={(v) => v.toFixed(3)}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(v) => [Number(v).toFixed(4), `${base}/${target}`] as [string, string]}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}