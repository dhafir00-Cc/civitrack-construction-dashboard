"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatCompactCurrency } from "@/lib/utils";

type DashboardChartsProps = {
  weeklyProgress: { week: string; target: number; actual: number }[];
  costDistribution: { name: string; value: number }[];
  materialUsage: { name: string; used: number; remaining: number }[];
};

const chartColors = ["#0b1f35", "#f59e0b", "#1f5f9f", "#10b981", "#ef4444", "#64748b"];

export function DashboardCharts({
  weeklyProgress,
  costDistribution,
  materialUsage
}: DashboardChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950">Progres Mingguan</h2>
            <p className="text-sm text-slate-500">Perbandingan target dan realisasi pekerjaan</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyProgress} margin={{ left: -20, right: 12 }}>
              <defs>
                <linearGradient id="actualProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#0b1f35"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Realisasi"
                stroke="#f59e0b"
                fill="url(#actualProgress)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-black text-slate-950">Distribusi Biaya</h2>
          <p className="text-sm text-slate-500">Biaya aktual berdasarkan kategori</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={3}
              >
                {costDistribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCompactCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-5">
          <h2 className="text-base font-black text-slate-950">Pemakaian Material</h2>
          <p className="text-sm text-slate-500">Stok terpakai dibandingkan sisa stok</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialUsage} margin={{ left: -20, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" name="Terpakai" stackId="a" fill="#0b1f35" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="remaining"
                name="Sisa"
                stackId="a"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
