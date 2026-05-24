import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WorkProgressPage() {
  const user = await requirePageAccess("work-progress");
  const project = await getPrimaryProject();
  const workItems = project
    ? await prisma.workItem.findMany({
        where: { projectId: project.id },
        orderBy: [{ startDate: "asc" }, { category: "asc" }]
      })
    : [];

  return (
    <DashboardShell
      user={user}
      title="Progres Kerja / WBS"
      description="Pantau kategori pekerjaan, bobot, target, realisasi progres, dan status."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Item WBS", workItems.length],
            ["Selesai", workItems.filter((item) => item.status === "COMPLETED").length],
            ["Berjalan", workItems.filter((item) => item.status === "IN_PROGRESS").length],
            ["Terlambat", workItems.filter((item) => item.status === "DELAYED").length]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <SmartTable
          rows={workItems.map((item) => ({
            id: item.id,
            category: item.category,
            name: item.name,
            weight: `${item.weight}%`,
            targetProgress: item.targetProgress,
            actualProgress: item.actualProgress,
            startDate: item.startDate.toISOString(),
            deadline: item.deadline.toISOString(),
            status: item.status
          }))}
          columns={[
            { key: "category", header: "Kategori" },
            { key: "name", header: "Nama Pekerjaan" },
            { key: "weight", header: "Bobot" },
            { key: "targetProgress", header: "Target", type: "progress" },
            { key: "actualProgress", header: "Realisasi", type: "progress" },
            { key: "startDate", header: "Mulai", type: "date" },
            { key: "deadline", header: "Tenggat", type: "date" },
            { key: "status", header: "Status", type: "status" }
          ]}
          searchPlaceholder="Cari item pekerjaan..."
          filterKey="status"
          filterLabel="Semua status pekerjaan"
        />
      </div>
    </DashboardShell>
  );
}
