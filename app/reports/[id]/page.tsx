import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PrintButton } from "@/components/ui/print-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateRange, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const user = await requirePageAccess("reports");
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          workItems: true,
          materials: true,
          costs: true,
          risks: true
        }
      }
    }
  });

  if (!report) notFound();

  const totalCost = report.project.costs.reduce((sum, cost) => sum + cost.amount, 0);
  const delayedTasks = report.project.workItems.filter((item) => item.status === "DELAYED").length;
  const materialAlerts = report.project.materials.filter((material) => material.status !== "SAFE").length;
  const openRisks = report.project.risks.filter((risk) => risk.status !== "RESOLVED").length;

  return (
    <DashboardShell
      user={user}
      title={statusLabel(report.type)}
      description="Layout laporan siap cetak untuk ekspor PDF melalui browser."
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex justify-end">
          <PrintButton />
        </div>

        <article className="print-surface rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amberline-600">
                Laporan Proyek CiviTrack
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">{report.title}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {report.project.name} • {report.project.location}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Periode: {formatDateRange(report.periodStart, report.periodEnd)}
              </p>
            </div>
            <StatusBadge value={report.type} />
          </header>

          <section className="grid gap-4 border-b border-slate-200 py-6 md:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Progres</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{report.project.overallProgress}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Biaya Aktual</p>
              <p className="mt-2 text-lg font-black text-slate-950">{formatCurrency(totalCost)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Pekerjaan Terlambat</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{delayedTasks}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Risiko Terbuka</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{openRisks}</p>
            </div>
          </section>

          <section className="grid gap-6 py-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Ringkasan Eksekutif</h2>
              <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {report.summary}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Narasi Laporan</h2>
              <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {report.content}
              </p>
            </div>
          </section>

          <section className="print-break grid gap-5 border-t border-slate-200 pt-6 md:grid-cols-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Peringatan Material</h2>
              <p className="mt-2 text-3xl font-black text-amber-700">{materialAlerts}</p>
              <p className="mt-1 text-sm text-slate-500">Material stok menipis atau habis.</p>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Kontrol Anggaran</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sisa anggaran adalah {formatCurrency(report.project.totalBudget - totalCost)} dari
                total anggaran {formatCurrency(report.project.totalBudget)}.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Tindakan Rekomendasi</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tinjau pemulihan jadwal, amankan material kritis, dan perbarui PIC mitigasi
                sebelum rapat koordinasi berikutnya.
              </p>
            </div>
          </section>
        </article>
      </div>
    </DashboardShell>
  );
}
