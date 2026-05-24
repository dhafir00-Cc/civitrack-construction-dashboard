import { HardHat, UsersRound, Wallet, UserCheck } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SmartTable } from "@/components/tables/smart-table";
import { StatCard } from "@/components/ui/stat-card";
import { requirePageAccess } from "@/lib/auth";
import { getPrimaryProject } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WorkersPage() {
  const user = await requirePageAccess("workers");
  const project = await getPrimaryProject();
  const workers = project
    ? await prisma.worker.findMany({
        where: { projectId: project.id },
        orderBy: { position: "asc" }
      })
    : [];

  const totalWage = workers.reduce((sum, worker) => sum + worker.totalWage, 0);
  const present = workers.filter((worker) => worker.attendanceStatus === "PRESENT").length;

  return (
    <DashboardShell
      user={user}
      title="Manajemen Pekerja"
      description="Pantau posisi pekerja, kehadiran, upah, dan hari kerja."
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-4">
          <StatCard title="Total Pekerja" value={String(workers.length)} detail="Tenaga kerja terdaftar" icon={<UsersRound size={22} />} />
          <StatCard title="Hadir Hari Ini" value={String(present)} detail="Kehadiran penuh" icon={<UserCheck size={22} />} accent="green" />
          <StatCard title="Upah Tenaga Kerja" value={formatCompactCurrency(totalWage)} detail="Total upah periode ini" icon={<Wallet size={22} />} accent="amber" />
          <StatCard title="Posisi Kunci" value="Site Engineer" detail="Koordinator teknis lapangan" icon={<HardHat size={22} />} accent="navy" />
        </section>

        <SmartTable
          rows={workers.map((worker) => ({
            id: worker.id,
            name: worker.name,
            position: worker.position,
            dailyWage: worker.dailyWage,
            workingDays: worker.workingDays,
            totalWage: worker.totalWage,
            attendanceStatus: worker.attendanceStatus
          }))}
          columns={[
            { key: "name", header: "Nama Pekerja" },
            { key: "position", header: "Posisi" },
            { key: "dailyWage", header: "Upah Harian", type: "currency" },
            { key: "workingDays", header: "Hari Kerja" },
            { key: "totalWage", header: "Total Upah", type: "currency" },
            { key: "attendanceStatus", header: "Kehadiran", type: "status" }
          ]}
          searchPlaceholder="Cari pekerja..."
          filterKey="position"
          filterLabel="Semua posisi"
        />
      </div>
    </DashboardShell>
  );
}
