"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RiskDistributionChart({
  distribution,
}: {
  distribution: { low: number; medium: number; high: number };
}) {
  const data = [
    { band: "Low (0–33)", vendors: distribution.low, fill: "var(--color-success-600)" },
    { band: "Medium (34–66)", vendors: distribution.medium, fill: "var(--color-warning-600)" },
    { band: "High (67–100)", vendors: distribution.high, fill: "var(--color-danger-600)" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="band"
          tick={{ fill: "var(--color-ink-500)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-border)" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "var(--color-ink-500)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--color-brand-100)" }}
          contentStyle={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Bar dataKey="vendors" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.band} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
