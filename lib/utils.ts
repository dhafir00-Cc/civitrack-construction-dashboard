import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(2)} M`;
  }

  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(0)} jt`;
  }

  return formatCurrency(value);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateRange(startDate: Date | string, endDate: Date | string) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function statusLabel(value: string) {
  const labels: Record<string, string> = {
    PLANNED: "Direncanakan",
    IN_PROGRESS: "Berjalan",
    AT_RISK: "Berisiko",
    COMPLETED: "Selesai",
    ON_HOLD: "Ditunda",
    DELAYED: "Terlambat",
    SAFE: "Aman",
    LOW_STOCK: "Stok Menipis",
    OUT_OF_STOCK: "Stok Habis",
    PRESENT: "Hadir",
    ABSENT: "Tidak Hadir",
    HALF_DAY: "Setengah Hari",
    LOW: "Rendah",
    MEDIUM: "Sedang",
    HIGH: "Tinggi",
    CRITICAL: "Kritis",
    OPEN: "Terbuka",
    IN_REVIEW: "Ditinjau",
    RESOLVED: "Selesai",
    DAILY: "Laporan Harian",
    WEEKLY_PROGRESS: "Progres Mingguan",
    MATERIAL_USAGE: "Pemakaian Material",
    COST: "Laporan Biaya",
    FINAL_SUMMARY: "Ringkasan Akhir"
  };

  return labels[value] ?? titleCase(value);
}

export function displayLabel(value: string) {
  const labels: Record<string, string> = {
    Material: "Material",
    Labor: "Tenaga Kerja",
    "Heavy equipment": "Alat Berat",
    Transportation: "Transportasi",
    Subcontractor: "Subkontraktor",
    "Unexpected cost": "Biaya Tak Terduga",
    Mandor: "Mandor",
    Tukang: "Tukang",
    Kenek: "Kenek",
    "Operator Alat": "Operator Alat",
    "Site Engineer": "Site Engineer",
    Admin: "Admin",
    "Project Manager": "Manajer Proyek",
    "Owner / Client": "Pemilik / Klien"
  };

  return labels[value] ?? statusLabel(value);
}

export function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function calculateScheduleSpan(start: Date | string, end: Date | string) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const duration = Math.max(1, endTime - startTime);

  return { startTime, endTime, duration };
}
