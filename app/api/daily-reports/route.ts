import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { canManageFieldData, canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || (!canManageFieldData(user.role) && !canManageProjects(user.role))) {
    return NextResponse.json({ message: "Tidak memiliki akses" }, { status: 403 });
  }

  const body = await request.json();
  const report = await prisma.dailyReport.create({
    data: {
      projectId: String(body.projectId),
      reportDate: new Date(body.reportDate),
      weather: String(body.weather),
      workerCount: Number(body.workerCount),
      workCompletedToday: String(body.workCompletedToday),
      materialUsed: String(body.materialUsed),
      equipmentUsed: String(body.equipmentUsed),
      siteProblems: String(body.siteProblems),
      notes: String(body.notes),
      photoPlaceholder: String(body.photoPlaceholder ?? "")
    }
  });

  return NextResponse.json(report, { status: 201 });
}
