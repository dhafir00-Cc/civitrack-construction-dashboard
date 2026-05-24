import { DailyReportForm } from "@/components/forms/daily-report-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { requirePageAccess } from "@/lib/auth";
import { canManageFieldData, canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DailyReportsPage() {
  const user = await requirePageAccess("daily-reports");
  const [projects, reports] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.dailyReport.findMany({
      include: { project: true },
      orderBy: { reportDate: "desc" }
    })
  ]);

  return (
    <DashboardShell
      user={user}
      title="Laporan Harian"
      description="Input laporan lapangan dan cetak catatan harian konstruksi."
    >
      <div className="space-y-6">
        <DailyReportForm
          projects={projects.map((project) => ({ id: project.id, name: project.name }))}
          canCreate={canManageFieldData(user.role) || canManageProjects(user.role)}
        />

        <SmartTable
          rows={reports.map((report) => ({
            id: report.id,
            reportDate: report.reportDate.toISOString(),
            project: report.project.name,
            weather: report.weather,
            workerCount: report.workerCount,
            workCompletedToday: report.workCompletedToday,
            siteProblems: report.siteProblems
          }))}
          columns={[
            { key: "reportDate", header: "Tanggal" , type: "date" },
            { key: "project", header: "Proyek" },
            { key: "weather", header: "Cuaca" },
            { key: "workerCount", header: "Pekerja" },
            { key: "workCompletedToday", header: "Pekerjaan Selesai" },
            { key: "siteProblems", header: "Kendala" }
          ]}
          searchPlaceholder="Cari laporan harian..."
          linkBase="/daily-reports"
          linkKey="id"
        />
      </div>
    </DashboardShell>
  );
}
