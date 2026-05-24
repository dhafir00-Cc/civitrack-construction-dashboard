import { Banknote, CircleDollarSign, PiggyBank, TrendingUp } from "lucide-react";

import { CostCategoryChart } from "@/components/charts/cost-category-chart";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { StatCard } from "@/components/ui/stat-card";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { displayLabel, formatCompactCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CostsPage() {
  const user = await requirePageAccess("costs");
  const project = await getPrimaryProject();
  const costs = project
    ? await prisma.cost.findMany({
        where: { projectId: project.id },
        orderBy: { date: "desc" }
      })
    : [];

  const totalActual = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const remainingBudget = project ? project.totalBudget - totalActual : 0;
  const costPercentage = project ? (totalActual / project.totalBudget) * 100 : 0;
  const costByCategory = Object.values(
    costs.reduce<Record<string, { name: string; value: number }>>((acc, cost) => {
      acc[cost.category] ??= { name: displayLabel(cost.category), value: 0 };
      acc[cost.category].value += cost.amount;
      return acc;
    }, {})
  );

  return (
    <DashboardShell
      user={user}
      title="Pelacakan Biaya"
      description="Pantau anggaran, biaya aktual, sisa anggaran, dan kategori biaya konstruksi."
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-4">
          <StatCard
            title="Total Anggaran"
            value={project ? formatCompactCurrency(project.totalBudget) : "Rp 0"}
            detail="Anggaran proyek disetujui"
            icon={<PiggyBank size={22} />}
          />
          <StatCard
            title="Biaya Aktual"
            value={formatCompactCurrency(totalActual)}
            detail="Pengeluaran tercatat"
            icon={<Banknote size={22} />}
            accent="amber"
          />
          <StatCard
            title="Sisa Anggaran"
            value={formatCompactCurrency(remainingBudget)}
            detail="Saldo tersedia"
            icon={<CircleDollarSign size={22} />}
            accent="green"
          />
          <StatCard
            title="Persentase Biaya"
            value={`${costPercentage.toFixed(1)}%`}
            detail="Aktual dibanding anggaran"
            icon={<TrendingUp size={22} />}
            accent={costPercentage > 80 ? "red" : "navy"}
          />
        </section>

        <CostCategoryChart data={costByCategory} />

        <SmartTable
          rows={costs.map((cost) => ({
            id: cost.id,
            category: displayLabel(cost.category),
            description: cost.description,
            date: cost.date.toISOString(),
            amount: cost.amount,
            project: project?.name ?? "-",
            notes: cost.notes
          }))}
          columns={[
            { key: "category", header: "Kategori Biaya" },
            { key: "description", header: "Deskripsi" },
            { key: "date", header: "Tanggal", type: "date" },
            { key: "amount", header: "Jumlah", type: "currency" },
            { key: "project", header: "Proyek" },
            { key: "notes", header: "Catatan" }
          ]}
          searchPlaceholder="Cari catatan biaya..."
          filterKey="category"
          filterLabel="Semua kategori"
        />
      </div>
    </DashboardShell>
  );
}
