import {
  AlertTriangle,
  Banknote,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  HardHat,
  TrendingUp
} from "lucide-react";

import { DashboardCharts } from "@/components/charts/dashboard-charts";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCompactCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ denied?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requirePageAccess("dashboard");
  const params = await searchParams;
  const data = await getDashboardData();

  if (!data) {
    return (
      <DashboardShell
        user={user}
        title="Ringkasan Dasbor"
        description="Data proyek belum ditemukan. Jalankan seed Prisma terlebih dahulu."
      >
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Database masih kosong.
        </div>
      </DashboardShell>
    );
  }

  const projectStatusText =
    data.project.status === "AT_RISK"
      ? "Perlu mitigasi"
      : data.project.status === "IN_PROGRESS"
        ? "Dalam pemantauan"
        : "Status portofolio";

  return (
    <DashboardShell
      user={user}
      title="Ringkasan Dasbor"
      description="Pantau progres, biaya, material, tenaga kerja, jadwal, dan risiko dari satu pusat kendali."
    >
      <div className="space-y-6">
        {params.denied ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Peran Anda tidak memiliki akses ke halaman tersebut.
          </div>
        ) : null}

        <section className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amberline-600">
                Proyek Utama
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {data.project.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                {data.project.location} • {data.project.client}
              </p>
            </div>
            <div className="min-w-72">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Progres Keseluruhan</span>
                <StatusBadge value={data.project.status} />
              </div>
              <ProgressBar value={data.project.overallProgress} target={72} />
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Progres"
            value={`${data.project.overallProgress}%`}
            detail="Dibanding target rencana 72%"
            accent="navy"
            icon={<TrendingUp size={22} />}
          />
          <StatCard
            title="Anggaran Terpakai"
            value={formatCompactCurrency(data.totalActualCost)}
            detail={`${data.budgetUsedPercent.toFixed(1)}% dari total anggaran`}
            accent="amber"
            icon={<Banknote size={22} />}
          />
          <StatCard
            title="Sisa Anggaran"
            value={formatCompactCurrency(data.remainingBudget)}
            detail="Saldo anggaran tersedia"
            accent="green"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Pekerja Aktif"
            value={String(data.activeWorkers)}
            detail="Hadir atau setengah hari"
            accent="slate"
            icon={<HardHat size={22} />}
          />
          <StatCard
            title="Pekerjaan Selesai"
            value={String(data.completedTasks)}
            detail="Item WBS sudah selesai"
            accent="green"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Pekerjaan Terlambat"
            value={String(data.delayedTasks)}
            detail="Perlu pemulihan jadwal"
            accent="red"
            icon={<Clock3 size={22} />}
          />
          <StatCard
            title="Stok Material"
            value={data.lowMaterialCount ? `${data.lowMaterialCount} Peringatan` : "Aman"}
            detail="Item stok menipis atau habis"
            accent={data.lowMaterialCount ? "amber" : "green"}
            icon={<Boxes size={22} />}
          />
          <StatCard
            title="Status Proyek"
            value={projectStatusText}
            detail="Berdasarkan jadwal, risiko, dan biaya"
            accent="amber"
            icon={<AlertTriangle size={22} />}
          />
        </section>

        <DashboardCharts
          weeklyProgress={data.weeklyProgress}
          costDistribution={data.costDistribution}
          materialUsage={data.materialUsage}
        />

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr_1.1fr]">
          <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-950">Laporan Harian Terbaru</h2>
            <div className="mt-4 space-y-4">
              {data.dailyReports.map((report) => (
                <div key={report.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{formatDate(report.reportDate)}</p>
                    <span className="text-xs font-semibold text-slate-500">{report.workerCount} pekerja</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {report.workCompletedToday}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-950">Risiko Proyek Terbaru</h2>
            <div className="mt-4 space-y-4">
              {data.risks.slice(0, 4).map((risk) => (
                <div key={risk.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-800">{risk.title}</p>
                    <StatusBadge value={risk.level} tone="risk" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{risk.impact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-navy-900 bg-navy-950 p-5 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-amberline-500 p-2 text-navy-950">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h2 className="text-base font-bold">Insight Proyek AI</h2>
                <p className="text-sm text-slate-300">Insight berbasis aturan dari data proyek</p>
              </div>
            </div>
            <div className="space-y-3 text-sm leading-6 text-slate-200">
              <p><span className="font-bold text-white">Keterlambatan:</span> {data.insight.delay}</p>
              <p><span className="font-bold text-white">Anggaran:</span> {data.insight.budget}</p>
              <p><span className="font-bold text-white">Material:</span> {data.insight.material}</p>
              <p><span className="font-bold text-white">Risiko:</span> {data.insight.risk}</p>
              <p className="rounded-lg bg-white/10 p-3 font-medium text-amberline-100">
                {data.insight.action}
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
