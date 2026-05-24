import { ShieldAlert, TriangleAlert } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RisksPage() {
  const user = await requirePageAccess("risks");
  const project = await getPrimaryProject();
  const risks = project
    ? await prisma.risk.findMany({
        where: { projectId: project.id },
        orderBy: [{ status: "asc" }, { level: "desc" }]
      })
    : [];

  const open = risks.filter((risk) => risk.status === "OPEN").length;
  const high = risks.filter((risk) => risk.level === "HIGH" || risk.level === "CRITICAL").length;
  const resolved = risks.filter((risk) => risk.status === "RESOLVED").length;

  return (
    <DashboardShell
      user={user}
      title="Risiko & Isu Proyek"
      description="Pantau risiko konstruksi berdasarkan dampak, penyebab, tindakan, level, dan status."
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-4">
          <StatCard title="Total Isu" value={String(risks.length)} detail="Item register risiko" icon={<ShieldAlert size={22} />} />
          <StatCard title="Isu Terbuka" value={String(open)} detail="Perlu tindak lanjut" icon={<TriangleAlert size={22} />} accent="amber" />
          <StatCard title="Prioritas Tinggi" value={String(high)} detail="Level tinggi atau kritis" icon={<ShieldAlert size={22} />} accent={high ? "red" : "green"} />
          <StatCard title="Terselesaikan" value={String(resolved)} detail="Mitigasi sudah ditutup" icon={<ShieldAlert size={22} />} accent="green" />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {risks.slice(0, 4).map((risk) => (
            <article key={risk.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-base font-bold text-slate-950">{risk.title}</h2>
                <div className="flex gap-2">
                  <StatusBadge value={risk.level} tone="risk" />
                  <StatusBadge value={risk.status} />
                </div>
              </div>
              <dl className="mt-4 space-y-3 text-sm leading-6">
                <div>
                  <dt className="font-bold text-slate-700">Dampak</dt>
                  <dd className="text-slate-500">{risk.impact}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-700">Penyebab</dt>
                  <dd className="text-slate-500">{risk.cause}</dd>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <dt className="font-bold text-amber-900">Tindakan Rekomendasi</dt>
                  <dd className="text-amber-800">{risk.recommendedAction}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>

        <SmartTable
          rows={risks.map((risk) => ({
            id: risk.id,
            title: risk.title,
            level: risk.level,
            impact: risk.impact,
            cause: risk.cause,
            recommendedAction: risk.recommendedAction,
            status: risk.status
          }))}
          columns={[
            { key: "title", header: "Judul Isu" },
            { key: "level", header: "Level Risiko", type: "risk" },
            { key: "impact", header: "Dampak" },
            { key: "cause", header: "Penyebab" },
            { key: "recommendedAction", header: "Rekomendasi" },
            { key: "status", header: "Status", type: "status" }
          ]}
          searchPlaceholder="Cari risiko dan isu..."
          filterKey="level"
          filterLabel="Semua level risiko"
        />
      </div>
    </DashboardShell>
  );
}
