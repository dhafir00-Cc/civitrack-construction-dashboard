import Link from "next/link";
import { ArrowRight, FileText, Printer } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { getReportsWithProject } from "@/lib/data";
import { formatDateRange, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requirePageAccess("reports");
  const reports = await getReportsWithProject();

  return (
    <DashboardShell
      user={user}
      title="Laporan"
      description="Laporan harian, progres mingguan, penggunaan material, biaya, dan ringkasan akhir proyek."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {reports.map((report) => (
          <article key={report.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-lg bg-navy-50 p-3 text-navy-700">
                <FileText size={22} />
              </div>
              <StatusBadge value={report.type} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-950">{report.title}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">{report.project.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {formatDateRange(report.periodStart, report.periodEnd)}
            </p>
            <p className="mt-4 min-h-16 text-sm leading-6 text-slate-600">{report.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/reports/${report.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Buka {statusLabel(report.type)}
                <ArrowRight size={16} />
              </Link>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <Printer size={16} />
                Siap cetak dari browser
              </span>
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
