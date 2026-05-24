import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectManager, type ProjectDTO } from "@/components/forms/project-manager";
import { requirePageAccess } from "@/lib/auth";
import { getAllProjects } from "@/lib/data";
import { canManageProjects } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function serializeProject(project: {
  id: string;
  name: string;
  location: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  description: string;
  status: string;
  overallProgress: number;
}): ProjectDTO {
  return {
    ...project,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate.toISOString()
  };
}

export default async function ProjectsPage() {
  const user = await requirePageAccess("projects");
  const projects = await getAllProjects();

  return (
    <DashboardShell
      user={user}
      title="Daftar Proyek"
      description="Buat, ubah, hapus, cari, dan tinjau data proyek konstruksi."
    >
      <ProjectManager
        initialProjects={projects.map(serializeProject)}
        canManage={canManageProjects(user.role)}
      />
    </DashboardShell>
  );
}
