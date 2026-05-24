import { notFound } from "next/navigation";
import { Banknote, CalendarDays, MapPin, ShieldAlert } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { getProjectDetail } from "@/lib/data";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const user = await requirePageAccess("projects");
  const { id } = await params;
  const project = await getProjectDetail(id);

  if (!project) notFound();

  const totalCost = project.costs.reduce((total, cost) => total + cost.amount, 0);
  const remainingBudget = project.totalBudget - totalCost;
  const highRisks = project.risks.filter((risk) => risk.level === "HIGH" || risk.level === "CRITICAL").length;

  return (
    <DashboardShell
      user={user}
      title="Detail Proyek"
      description="Profil proyek lengkap dengan progres, jadwal, biaya, material, dan risiko."
    >
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <StatusBadge value={project.status} />
                <span className="text-sm font-semibold text-slate-500">
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-950">{project.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={16} />
                {project.location} • {project.client}
              </p>
              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">{project.description}</p>
            </div>
            <div className="min-w-72 rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Progres keseluruhan</span>
                <span className="text-sm font-bold text-slate-950">{project.overallProgress}%</span>
              </div>
              <ProgressBar value={project.overallProgress} showLabel={false} />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Anggaran"
            value={formatCurrency(project.totalBudget)}
            detail="Anggaran konstruksi disetujui"
            icon={<Banknote size={22} />}
            accent="navy"
          />
          <StatCard
            title="Biaya Aktual"
            value={formatCurrency(totalCost)}
            detail="Tercatat dari pelacakan biaya"
            icon={<Banknote size={22} />}
            accent="amber"
          />
          <StatCard
            title="Sisa Anggaran"
            value={formatCurrency(remainingBudget)}
            detail="Anggaran setelah biaya aktual"
            icon={<CalendarDays size={22} />}
            accent="green"
          />
          <StatCard
            title="Risiko Tinggi"
            value={String(highRisks)}
            detail="Item risiko tinggi atau kritis"
            icon={<ShieldAlert size={22} />}
            accent={highRisks ? "red" : "green"}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-950">Struktur Rincian Pekerjaan (WBS)</h2>
            <SmartTable
              rows={project.workItems.map((item) => ({
                id: item.id,
                category: item.category,
                name: item.name,
                weight: `${item.weight}%`,
                targetProgress: item.targetProgress,
                actualProgress: item.actualProgress,
                status: item.status
              }))}
              columns={[
                { key: "category", header: "Kategori" },
                { key: "name", header: "Nama Pekerjaan" },
                { key: "weight", header: "Bobot" },
                { key: "actualProgress", header: "Realisasi", type: "progress" },
                { key: "status", header: "Status", type: "status" }
              ]}
              searchPlaceholder="Cari WBS..."
              filterKey="status"
            />
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-950">Risiko Terbaru</h2>
            <SmartTable
              rows={project.risks.map((risk) => ({
                id: risk.id,
                title: risk.title,
                level: risk.level,
                status: risk.status,
                impact: risk.impact
              }))}
              columns={[
                { key: "title", header: "Judul Isu" },
                { key: "level", header: "Risiko", type: "risk" },
                { key: "status", header: "Status", type: "status" },
                { key: "impact", header: "Dampak" }
              ]}
              searchPlaceholder="Cari risiko..."
              filterKey="level"
            />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
