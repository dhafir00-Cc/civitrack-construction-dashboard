import { Boxes, PackageCheck, PackageMinus, TriangleAlert } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { StatCard } from "@/components/ui/stat-card";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const user = await requirePageAccess("materials");
  const project = await getPrimaryProject();
  const materials = project
    ? await prisma.material.findMany({
        where: { projectId: project.id },
        orderBy: { name: "asc" }
      })
    : [];

  const safe = materials.filter((material) => material.status === "SAFE").length;
  const low = materials.filter((material) => material.status === "LOW_STOCK").length;
  const out = materials.filter((material) => material.status === "OUT_OF_STOCK").length;

  return (
    <DashboardShell
      user={user}
      title="Monitoring Material"
      description="Pantau stok awal, stok masuk, pemakaian, sisa stok, dan status material."
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-4">
          <StatCard title="Item Material" value={String(materials.length)} detail="Material terpantau" icon={<Boxes size={22} />} />
          <StatCard title="Stok Aman" value={String(safe)} detail="Siap untuk pekerjaan" icon={<PackageCheck size={22} />} accent="green" />
          <StatCard title="Stok Menipis" value={String(low)} detail="Perlu pengadaan" icon={<TriangleAlert size={22} />} accent="amber" />
          <StatCard title="Stok Habis" value={String(out)} detail="Berpotensi menghambat kerja" icon={<PackageMinus size={22} />} accent={out ? "red" : "green"} />
        </section>

        <SmartTable
          rows={materials.map((material) => ({
            id: material.id,
            name: material.name,
            unit: material.unit,
            initialStock: material.initialStock,
            incomingStock: material.incomingStock,
            usedStock: material.usedStock,
            remainingStock: material.remainingStock,
            status: material.status
          }))}
          columns={[
            { key: "name", header: "Nama Material" },
            { key: "unit", header: "Satuan" },
            { key: "initialStock", header: "Stok Awal" },
            { key: "incomingStock", header: "Masuk" },
            { key: "usedStock", header: "Terpakai" },
            { key: "remainingStock", header: "Sisa" },
            { key: "status", header: "Status", type: "status" }
          ]}
          searchPlaceholder="Cari material..."
          filterKey="status"
          filterLabel="Semua status stok"
        />
      </div>
    </DashboardShell>
  );
}
