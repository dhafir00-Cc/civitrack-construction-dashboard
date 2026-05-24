import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  Gauge,
  HardHat,
  ShieldAlert
} from "lucide-react";

const features = [
  {
    title: "Kontrol Proyek",
    description: "Pantau progres, anggaran, jadwal, dan performa lapangan dalam satu ruang kerja.",
    icon: Gauge
  },
  {
    title: "Alur Kerja Sipil",
    description: "Kelola WBS dari persiapan, pondasi, struktur, finishing, hingga MEP.",
    icon: Building2
  },
  {
    title: "Laporan Lapangan",
    description: "Catat cuaca, tenaga kerja, material, alat, kendala, dan laporan siap cetak.",
    icon: ClipboardCheck
  },
  {
    title: "Visibilitas Risiko",
    description: "Prioritaskan risiko konstruksi berdasarkan dampak, penyebab, status, dan tindakan.",
    icon: ShieldAlert
  }
];

export default function LandingPage() {
  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85"
          alt="Area konstruksi dengan tower crane"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/35" />
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white/95 p-1 shadow-lg shadow-black/20">
              <img
                src="/logo-civitrack.png"
                alt="Logo CiviTrack"
                className="h-full w-full object-contain"
              />
            </span>
            <span>
              <span className="block text-lg font-bold">CiviTrack</span>
              <span className="block text-xs text-slate-300">Dasbor Konstruksi</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-amberline-100"
          >
            Masuk
          </Link>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-amberline-100 backdrop-blur">
              Proyek portofolio teknik sipil
            </p>
            <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              CiviTrack
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-200">
              Monitoring konstruksi cerdas untuk kendali proyek yang lebih baik.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Dasbor full-stack untuk memantau progres proyek, laporan harian,
              material, biaya, tenaga kerja, jadwal, risiko, dan laporan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-amberline-500 px-5 py-3 text-sm font-bold text-navy-950 hover:bg-amberline-100"
              >
                Buka Dasbor
                <ArrowRight size={17} />
              </Link>
              <a
                href="#features"
                className="rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/95 p-4 shadow-soft">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Proyek Utama
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-navy-950">
                    Pembangunan Gedung Laboratorium Teknik
                  </h2>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Berisiko
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Progres", "64%"],
                  ["Anggaran", "Rp 1,25 M"],
                  ["Pekerja", "45"],
                  ["Tugas Terlambat", "2"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Progres mingguan</span>
                  <BarChart3 size={18} className="text-amberline-600" />
                </div>
                <div className="flex h-28 items-end gap-3">
                  {[48, 54, 59, 62, 64].map((value) => (
                    <div key={value} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t bg-navy-900"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-[11px] font-semibold text-slate-500">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-navy-950 p-4 text-white">
                <div className="flex items-start gap-3">
                  <HardHat className="mt-0.5 text-amberline-500" size={20} />
                  <p className="text-sm leading-6 text-slate-200">
                    Insight AI: progres tertinggal 8% dari jadwal. Amankan pengiriman
                    material dan prioritaskan pekerjaan struktur pekan ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-navy-50 p-3 text-navy-700">
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
