"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  HardHat,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Search,
  TriangleAlert,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { navItems } from "@/lib/navigation";
import { canAccess, roleLabel, type Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  user: {
    name: string;
    email: string;
    role: Role;
    position: string;
  };
  title: string;
  description?: string;
  children: ReactNode;
};

const iconMap = {
  LayoutDashboard,
  Building2,
  ListChecks,
  ClipboardList,
  Boxes,
  WalletCards,
  HardHat,
  CalendarDays,
  TriangleAlert,
  FileText,
  UserRound
};

export function DashboardShell({ user, title, description, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleItems = useMemo(
    () => navItems.filter((item) => canAccess(user.role, item.section)),
    [user.role]
  );

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-navy-950 text-white shadow-2xl shadow-navy-950/30">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-lg bg-white/95 p-1 shadow-lg shadow-amberline-500/20">
            <img
              src="/logo-civitrack.png"
              alt="Logo CiviTrack"
              className="h-full w-full object-contain"
            />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-wide">CiviTrack</span>
            <span className="block text-xs text-slate-300">Kontrol Konstruksi</span>
          </span>
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        {visibleItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition",
                active && "bg-white text-navy-950 shadow-lg shadow-black/10",
                !active && "hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/10 p-3">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="mt-0.5 text-xs text-slate-300">{roleLabel(user.role)}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">{sidebar}</div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup navigasi"
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Buka navigasi"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 ring-1 ring-transparent transition focus-within:border-amberline-500 focus-within:bg-white focus-within:ring-amberline-100 lg:flex">
              <Search size={16} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Cari proyek, laporan, material..."
                aria-label="Pencarian global"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.position}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-amberline-300 hover:bg-amber-50 hover:text-navy-900"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
