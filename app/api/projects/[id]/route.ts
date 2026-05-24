import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();

  if (!user || !canManageProjects(user.role)) {
    return NextResponse.json({ message: "Tidak memiliki akses" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const project = await prisma.project.update({
    where: { id },
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

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();

  if (!user || !canManageProjects(user.role)) {
    return NextResponse.json({ message: "Tidak memiliki akses" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
