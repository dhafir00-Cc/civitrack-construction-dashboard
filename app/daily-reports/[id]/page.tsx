import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PrintButton } from "@/components/ui/print-button";
import { requirePageAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DailyReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DailyReportDetailPage({ params }: DailyReportDetailPageProps) {
  const user = await requirePageAccess("daily-reports");
  const { id } = await params;
  const report = await prisma.dailyReport.findUnique({
    where: { id },
    include: { project: true }
  });

  if (!report) notFound();

  return (
    <DashboardShell
      user={user}
      title="Laporan Harian Cetak"
      description="Gunakan fitur cetak browser untuk menyimpan laporan sebagai PDF."
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex justify-end">
          <PrintButton />
        </div>

        <article className="print-surface rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <header className="border-b border-slate-200 pb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-amberline-600">
              Laporan Harian Lapangan CiviTrack
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{report.project.name}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {report.project.location} • {report.project.client}
            </p>
          </header>

          <section className="grid gap-4 border-b border-slate-200 py-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Tanggal Laporan</p>
              <p className="mt-1 font-semibold text-slate-900">{formatDate(report.reportDate)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Cuaca</p>
              <p className="mt-1 font-semibold text-slate-900">{report.weather}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Pekerja</p>
              <p className="mt-1 font-semibold text-slate-900">{report.workerCount} orang</p>
            </div>
          </section>

          <section className="grid gap-6 py-6">
            {[
              ["Pekerjaan Selesai Hari Ini", report.workCompletedToday],
              ["Material Terpakai", report.materialUsed],
              ["Peralatan Digunakan", report.equipmentUsed],
              ["Masalah / Kendala Lapangan", report.siteProblems],
              ["Catatan", report.notes]
            ].map(([label, value]) => (
              <div key={label}>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{label}</h2>
                <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">{value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-lg border border-dashed border-slate-300 p-5">
            <p className="text-sm font-bold text-slate-700">Placeholder Dokumentasi Foto</p>
            <p className="mt-2 text-sm text-slate-500">
              {report.photoPlaceholder || "Belum ada placeholder foto."}
            </p>
          </section>

          <footer className="mt-10 grid gap-6 text-sm md:grid-cols-2">
            <div className="border-t border-slate-300 pt-3">
              <p className="font-semibold text-slate-800">Disiapkan oleh Site Engineer</p>
            </div>
            <div className="border-t border-slate-300 pt-3">
              <p className="font-semibold text-slate-800">Disetujui oleh Manajer Proyek</p>
            </div>
          </footer>
        </article>
      </div>
    </DashboardShell>
  );
}
