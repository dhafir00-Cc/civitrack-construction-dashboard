import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: "navy" | "amber" | "green" | "red" | "slate";
  trend?: string;
};

export function StatCard({ title, value, detail, icon, accent = "navy", trend }: StatCardProps) {
  const tones = {
    navy: "bg-navy-50 text-navy-700 ring-navy-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <div className="group rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={cn("rounded-lg p-2.5 ring-1", tones[accent])}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-sm leading-5 text-slate-500">{detail}</p>
        {trend ? (
          <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}
