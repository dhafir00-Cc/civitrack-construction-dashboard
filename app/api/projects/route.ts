import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !canManageProjects(user.role)) {
    return NextResponse.json({ message: "Tidak memiliki akses" }, { status: 403 });
  }

  const body = await request.json();
  const project = await prisma.project.create({
    data: {
      name: String(body.name),
      location: String(body.location),
      client: String(body.client),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      totalBudget: Number(body.totalBudget),
      description: String(body.description),
      status: body.status,
      overallProgress: Number(body.overallProgress)
    }
  });

  return NextResponse.json(project, { status: 201 });
}
