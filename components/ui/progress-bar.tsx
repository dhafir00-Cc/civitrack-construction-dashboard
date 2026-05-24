import { clampPercent, cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  target?: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  target,
  size = "md",
  showLabel = true,
  className
}: ProgressBarProps) {
  const safeValue = clampPercent(value);
  const isBehind = typeof target === "number" && value < target;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 ring-1 ring-inset ring-slate-200",
            size === "sm" && "h-2"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-navy-800 to-navy-500 transition-all",
              isBehind && "from-amberline-600 to-amberline-500"
            )}
            style={{ width: `${safeValue}%` }}
          />
        </div>
        {showLabel ? (
          <span className="min-w-10 text-right text-xs font-semibold text-slate-700">
            {safeValue}%
          </span>
        ) : null}
      </div>
      {typeof target === "number" ? (
        <div className="mt-1 text-xs text-slate-500">Target {target}%</div>
      ) : null}
    </div>
  );
}
