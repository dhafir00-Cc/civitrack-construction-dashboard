"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

const demoAccounts = [
  { label: "Admin", email: "admin@civitrack.test", password: "admin123" },
  { label: "Manajer Proyek", email: "manager@civitrack.test", password: "manager123" },
  { label: "Site Engineer", email: "engineer@civitrack.test", password: "engineer123" },
  { label: "Pemilik", email: "owner@civitrack.test", password: "owner123" }
];

type LoginFormProps = {
  hasError?: boolean;
};

export function LoginForm({ hasError = false }: LoginFormProps) {
  const [email, setEmail] = useState("admin@civitrack.test");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-md rounded-lg border border-white/30 bg-white p-6 shadow-soft">
      <div className="mb-6">
        <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2.5 text-amber-700 ring-1 ring-amber-100">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">Masuk ke CiviTrack</h1>
        <p className="mt-2 text-sm text-slate-500">
          Gunakan akun demo untuk melihat alur kerja konstruksi sesuai peran.
        </p>
      </div>

      <form action="/api/auth/login" method="post" onSubmit={() => setLoading(true)} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Kata Sandi
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
            required
          />
        </label>
        {hasError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Login gagal. Gunakan salah satu akun demo di bawah.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-navy-900/15 transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 grid gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Akun demo</p>
        {demoAccounts.map((account) => (
          <button
            type="button"
            key={account.email}
            onClick={() => {
              setEmail(account.email);
              setPassword(account.password);
            }}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs transition hover:border-amberline-300 hover:bg-amber-50/60"
          >
            <span className="font-semibold text-slate-700">{account.label}</span>
            <span className="text-slate-500">{account.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
