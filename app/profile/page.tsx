import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requirePageAccess } from "@/lib/auth";
import { navItems } from "@/lib/navigation";
import { canAccess, roleLabel } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requirePageAccess("profile");
  const accessList = navItems.filter((item) => canAccess(user.role, item.section));

  return (
    <DashboardShell
      user={user}
      title="Profil"
      description="Tinjau akun demo aktif, izin peran, dan perilaku autentikasi portfolio."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-navy-900 text-white">
              <UserRound size={30} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-4">
              <dt className="font-bold text-slate-700">Peran</dt>
              <dd className="mt-1 text-slate-600">{roleLabel(user.role)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <dt className="font-bold text-slate-700">Posisi</dt>
              <dd className="mt-1 text-slate-600">{user.position}</dd>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <dt className="font-bold text-amber-900">Autentikasi Demo</dt>
              <dd className="mt-1 text-amber-800">
                Login kredensial lokal menggunakan cookie sesi HTTP-only. Kata sandi
                adalah nilai demo untuk pengujian portfolio saja.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Akses Berdasarkan Peran</h2>
              <p className="text-sm text-slate-500">Halaman yang tersedia untuk akun ini.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {accessList.map((item) => (
              <div key={item.href} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <KeyRound size={16} className="text-amberline-600" />
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
