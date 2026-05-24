export type Role = "ADMIN" | "PROJECT_MANAGER" | "SITE_ENGINEER" | "OWNER";

export type AppSection =
  | "dashboard"
  | "projects"
  | "work-progress"
  | "daily-reports"
  | "materials"
  | "costs"
  | "workers"
  | "schedule"
  | "risks"
  | "reports"
  | "profile";

const allSections: AppSection[] = [
  "dashboard",
  "projects",
  "work-progress",
  "daily-reports",
  "materials",
  "costs",
  "workers",
  "schedule",
  "risks",
  "reports",
  "profile"
];

export const rolePermissions: Record<Role, AppSection[]> = {
  ADMIN: allSections,
  PROJECT_MANAGER: [
    "dashboard",
    "projects",
    "work-progress",
    "daily-reports",
    "costs",
    "schedule",
    "risks",
    "reports",
    "profile"
  ],
  SITE_ENGINEER: [
    "dashboard",
    "work-progress",
    "daily-reports",
    "materials",
    "workers",
    "schedule",
    "reports",
    "profile"
  ],
  OWNER: ["dashboard", "projects", "work-progress", "reports", "profile"]
};

export function canAccess(role: Role, section: AppSection) {
  return rolePermissions[role]?.includes(section) ?? false;
}

export function canManageProjects(role: Role) {
  return role === "ADMIN" || role === "PROJECT_MANAGER";
}

export function canManageFieldData(role: Role) {
  return role === "ADMIN" || role === "SITE_ENGINEER";
}

export function canManageCostsAndRisks(role: Role) {
  return role === "ADMIN" || role === "PROJECT_MANAGER";
}

export function roleLabel(role: Role) {
  const labels: Record<Role, string> = {
    ADMIN: "Admin",
    PROJECT_MANAGER: "Manajer Proyek",
    SITE_ENGINEER: "Site Engineer",
    OWNER: "Pemilik / Klien"
  };

  return labels[role];
}
