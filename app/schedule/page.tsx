import { CalendarDays } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function percent(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(2)}%`;
}

export default async function SchedulePage() {
  const user = await requirePageAccess("schedule");
  const project = await getPrimaryProject();
  const schedules = project
    ? await prisma.schedule.findMany({
        where: { projectId: project.id },
        orderBy: { startDate: "asc" }
      })
    : [];

  const minTime = Math.min(...schedules.map((item) => item.startDate.getTime()));
  const maxTime = Math.max(...schedules.map((item) => item.endDate.getTime()));
  const totalSpan = Math.max(1, maxTime - minTime);

  return (
    <DashboardShell
      user={user}
      title="Jadwal / Timeline"
      description="Timeline bergaya Gantt untuk pekerjaan direncanakan, berjalan, terlambat, dan selesai."
    >
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">Timeline Konstruksi</h2>
            <p className="text-sm text-slate-500">
              {project?.name ?? "Belum ada proyek"} • {schedules.length} aktivitas terjadwal
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            <CalendarDays size={16} />
            {schedules[0] ? `${formatDate(schedules[0].startDate)} - ${formatDate(schedules.at(-1)!.endDate)}` : "Belum ada timeline"}
          </div>
        </div>

        <div className="space-y-4 overflow-x-auto pb-2">
          <div className="min-w-[900px]">
            {schedules.map((item) => {
              const left = ((item.startDate.getTime() - minTime) / totalSpan) * 100;
              const width = ((item.endDate.getTime() - item.startDate.getTime()) / totalSpan) * 100;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[240px_1fr_170px] items-center gap-4 border-b border-slate-100 py-4 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.workItem}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </p>
                  </div>
                  <div className="relative h-12 rounded-lg bg-slate-100">
                    <div
                      className="absolute top-2 h-8 rounded-lg bg-navy-900"
                      style={{ left: percent(left), width: percent(Math.max(width, 4)) }}
                    >
                      <div
                        className="h-full rounded-lg bg-amberline-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    {item.isDelayed ? (
                      <span
                        className="absolute -top-1 h-14 w-1 rounded-full bg-red-500"
                        style={{ left: percent(Math.min(left + width, 99)) }}
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <StatusBadge value={item.status} />
                    <ProgressBar value={item.progress} size="sm" />
                    <p className="text-xs font-semibold text-slate-500">
                      {item.isDelayed ? "Indikator keterlambatan aktif" : "Sesuai rencana"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
