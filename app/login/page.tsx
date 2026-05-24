import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-950">
      <img
        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=85"
        alt="Tim konstruksi meninjau rencana proyek"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/88 to-navy-800/55" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white/95 p-1 shadow-lg shadow-black/20">
              <img
                src="/logo-civitrack.png"
                alt="Logo CiviTrack"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-lg font-bold">CiviTrack</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-200 hover:text-white">
            Kembali ke beranda
          </Link>
        </header>

        <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="max-w-2xl text-white">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-amberline-100 backdrop-blur">
              Akses demo berbasis peran
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Kendali proyek konstruksi yang rapi untuk setiap pemangku kepentingan.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Admin, manajer proyek, site engineer, dan pemilik proyek mendapatkan
              tampilan kerja sesuai tanggung jawabnya.
            </p>
          </div>
          <LoginForm hasError={params.error === "1"} />
        </div>
      </div>
    </main>
  );
}
