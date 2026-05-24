"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatCompactCurrency } from "@/lib/utils";

type CostCategoryChartProps = {
  data: { name: string; value: number }[];
};

export function CostCategoryChart({ data }: CostCategoryChartProps) {
  return (
    <div className="h-80 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-base font-black text-slate-950">Grafik Biaya per Kategori</h2>
      <p className="mb-5 text-sm text-slate-500">Distribusi pengeluaran aktual proyek</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ left: -4, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip formatter={(value) => formatCompactCurrency(Number(value))} />
          <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
