import "server-only";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export async function getPrimaryProject() {
  const project = await prisma.project.findFirst({
    where: { name: "Pembangunan Gedung Laboratorium Teknik" },
    orderBy: { createdAt: "asc" }
  });

  if (project) return project;

  return prisma.project.findFirst({
    orderBy: { createdAt: "asc" }
  });
}

export async function getDashboardData() {
  const project = await getPrimaryProject();

  if (!project) {
    return null;
  }

  const [projects, workItems, costs, materials, risks, dailyReports, workers] =
    await Promise.all([
      prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.workItem.findMany({
        where: { projectId: project.id },
        orderBy: [{ startDate: "asc" }, { category: "asc" }]
      }),
      prisma.cost.findMany({
        where: { projectId: project.id },
        orderBy: { date: "desc" }
      }),
      prisma.material.findMany({
        where: { projectId: project.id },
        orderBy: { name: "asc" }
      }),
      prisma.risk.findMany({
        where: { projectId: project.id },
        orderBy: [{ level: "desc" }, { createdAt: "desc" }]
      }),
      prisma.dailyReport.findMany({
        where: { projectId: project.id },
        orderBy: { reportDate: "desc" },
        take: 4
      }),
      prisma.worker.findMany({
        where: { projectId: project.id }
      })
    ]);

  const totalActualCost = costs.reduce((total, cost) => total + cost.amount, 0);
  const remainingBudget = project.totalBudget - totalActualCost;
  const budgetUsedPercent = (totalActualCost / project.totalBudget) * 100;
  const completedTasks = workItems.filter((item) => item.status === "COMPLETED").length;
  const delayedTasks = workItems.filter((item) => item.status === "DELAYED").length;
  const activeWorkers = workers.filter((worker) => worker.attendanceStatus !== "ABSENT").length;
  const lowMaterialCount = materials.filter(
    (material) => material.status === "LOW_STOCK" || material.status === "OUT_OF_STOCK"
  ).length;
  const targetProgress = 72;
  const delay = Math.max(0, targetProgress - project.overallProgress);

  const costDistribution = Object.values(
    costs.reduce<Record<string, { name: string; value: number }>>((acc, cost) => {
      acc[cost.category] ??= { name: cost.category, value: 0 };
      acc[cost.category].value += cost.amount;
      return acc;
    }, {})
  );

  const materialUsage = materials.map((material) => ({
    name: material.name,
    used: material.usedStock,
    remaining: material.remainingStock
  }));

  const weeklyProgress = [
    { week: "W16", target: 52, actual: 49 },
    { week: "W17", target: 58, actual: 54 },
    { week: "W18", target: 64, actual: 59 },
    { week: "W19", target: 68, actual: 62 },
    { week: "W20", target: targetProgress, actual: project.overallProgress }
  ];

  const highRisks = risks.filter((risk) => risk.level === "HIGH" || risk.level === "CRITICAL");
  const materialInsight =
    lowMaterialCount > 0
      ? `${lowMaterialCount} material perlu perhatian, terutama ${materials
          .filter((material) => material.status !== "SAFE")
          .map((material) => material.name)
          .slice(0, 3)
          .join(", ")}.`
      : "Seluruh material yang dipantau berada pada rentang stok aman.";

  return {
    project,
    projects,
    workItems,
    costs,
    materials,
    risks,
    dailyReports,
    activeWorkers,
    completedTasks,
    delayedTasks,
    lowMaterialCount,
    totalActualCost,
    remainingBudget,
    budgetUsedPercent,
    weeklyProgress,
    costDistribution,
    materialUsage,
    insight: {
      delay: `Progres proyek saat ini tertinggal ${delay}% dari target ${targetProgress}%.`,
      budget: `Penggunaan anggaran mencapai ${budgetUsedPercent.toFixed(1)}%, dengan sisa ${formatCurrency(
        remainingBudget
      )}.`,
      material: materialInsight,
      risk:
        highRisks.length > 0
          ? `Risiko utama adalah ${highRisks.map((risk) => risk.title).slice(0, 2).join(" dan ")}.`
          : "Tidak ada risiko tinggi atau kritis yang masih terbuka.",
      action:
        "Rekomendasi tindakan: prioritaskan pekerjaan struktur, amankan pengiriman material, dan seimbangkan alokasi tenaga kerja pada zona kritis."
    }
  };
}

export async function getProjectDetail(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      workItems: { orderBy: { startDate: "asc" } },
      dailyReports: { orderBy: { reportDate: "desc" } },
      materials: { orderBy: { name: "asc" } },
      costs: { orderBy: { date: "desc" } },
      risks: { orderBy: { createdAt: "desc" } },
      schedules: { orderBy: { startDate: "asc" } }
    }
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: { updatedAt: "desc" }
  });
}

export async function getReportsWithProject() {
  return prisma.report.findMany({
    include: { project: true },
    orderBy: [{ periodEnd: "desc" }, { createdAt: "desc" }]
  });
}
