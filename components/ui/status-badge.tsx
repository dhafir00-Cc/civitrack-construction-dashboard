import { cn, statusLabel } from "@/lib/utils";

type StatusBadgeProps = {
  value: string;
  tone?: "status" | "risk" | "material" | "attendance";
};

export function StatusBadge({ value, tone = "status" }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    PLANNED: "border-slate-200 bg-slate-50 text-slate-700 before:bg-slate-400",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700 before:bg-blue-500",
    AT_RISK: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700 before:bg-emerald-500",
    ON_HOLD: "border-zinc-200 bg-zinc-50 text-zinc-700 before:bg-zinc-400",
    DELAYED: "border-red-200 bg-red-50 text-red-700 before:bg-red-500",
    SAFE: "border-emerald-200 bg-emerald-50 text-emerald-700 before:bg-emerald-500",
    LOW_STOCK: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
    OUT_OF_STOCK: "border-red-200 bg-red-50 text-red-700 before:bg-red-500",
    PRESENT: "border-emerald-200 bg-emerald-50 text-emerald-700 before:bg-emerald-500",
    ABSENT: "border-red-200 bg-red-50 text-red-700 before:bg-red-500",
    HALF_DAY: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
    LOW: "border-sky-200 bg-sky-50 text-sky-700 before:bg-sky-500",
    MEDIUM: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
    HIGH: "border-orange-200 bg-orange-50 text-orange-800 before:bg-orange-500",
    CRITICAL: "border-red-200 bg-red-50 text-red-700 before:bg-red-500",
    OPEN: "border-red-200 bg-red-50 text-red-700 before:bg-red-500",
    IN_REVIEW: "border-amber-200 bg-amber-50 text-amber-800 before:bg-amber-500",
    RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-700 before:bg-emerald-500"
  };

  return (
    <span
      data-tone={tone}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold before:h-1.5 before:w-1.5 before:rounded-full",
        styles[value] ?? "border-slate-200 bg-slate-50 text-slate-700 before:bg-slate-400"
      )}
    >
      {statusLabel(value)}
    </span>
  );
}
