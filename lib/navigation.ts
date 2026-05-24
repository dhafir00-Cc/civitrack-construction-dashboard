import type { AppSection } from "@/lib/permissions";

export type NavItem = {
  label: string;
  href: string;
  section: AppSection;
  icon: string;
};

export const navItems: NavItem[] = [
  {
    label: "Dasbor",
    href: "/dashboard",
    section: "dashboard",
    icon: "LayoutDashboard"
  },
  { label: "Proyek", href: "/projects", section: "projects", icon: "Building2" },
  {
    label: "Progres Kerja",
    href: "/work-progress",
    section: "work-progress",
    icon: "ListChecks"
  },
  {
    label: "Laporan Harian",
    href: "/daily-reports",
    section: "daily-reports",
    icon: "ClipboardList"
  },
  { label: "Material", href: "/materials", section: "materials", icon: "Boxes" },
  { label: "Biaya", href: "/costs", section: "costs", icon: "WalletCards" },
  { label: "Pekerja", href: "/workers", section: "workers", icon: "HardHat" },
  { label: "Jadwal", href: "/schedule", section: "schedule", icon: "CalendarDays" },
  { label: "Risiko", href: "/risks", section: "risks", icon: "TriangleAlert" },
  { label: "Laporan", href: "/reports", section: "reports", icon: "FileText" },
  { label: "Profil", href: "/profile", section: "profile", icon: "UserRound" }
];
