"use client";

import { Camera, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProjectOption = {
  id: string;
  name: string;
};

type DailyReportFormProps = {
  projects: ProjectOption[];
  canCreate: boolean;
};

const initialState = {
  projectId: "",
  reportDate: new Date().toISOString().slice(0, 10),
  weather: "Cerah berawan",
  workerCount: 0,
  workCompletedToday: "",
  materialUsed: "",
  equipmentUsed: "",
  siteProblems: "",
  notes: "",
  photoPlaceholder: ""
};

export function DailyReportForm({ projects, canCreate }: DailyReportFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...initialState,
    projectId: projects[0]?.id ?? ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!canCreate) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Peran Anda dapat melihat laporan harian, tetapi tidak dapat mengirim laporan lapangan baru.
      </div>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/daily-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setStatus("Laporan belum bisa disimpan. Periksa formulir lalu coba lagi.");
      setSubmitting(false);
      return;
    }

    setStatus("Laporan harian berhasil disimpan.");
    setForm({ ...initialState, projectId: projects[0]?.id ?? "" });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950">Input Laporan Harian</h2>
          <p className="text-sm text-slate-500">Catat progres lapangan, pekerja, material, alat, dan kendala.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          {submitting ? "Menyimpan..." : "Simpan Laporan"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Proyek
          <select
            value={form.projectId}
            onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Tanggal laporan
          <input
            type="date"
            value={form.reportDate}
            onChange={(event) => setForm((current) => ({ ...current, reportDate: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Cuaca
          <input
            value={form.weather}
            onChange={(event) => setForm((current) => ({ ...current, weather: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Jumlah pekerja
          <input
            type="number"
            min="0"
            value={form.workerCount}
            onChange={(event) =>
              setForm((current) => ({ ...current, workerCount: Number(event.target.value) }))
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
          Pekerjaan selesai hari ini
          <textarea
            value={form.workCompletedToday}
            onChange={(event) =>
              setForm((current) => ({ ...current, workCompletedToday: event.target.value }))
            }
            className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Material terpakai
          <textarea
            value={form.materialUsed}
            onChange={(event) => setForm((current) => ({ ...current, materialUsed: event.target.value }))}
            className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Peralatan digunakan
          <textarea
            value={form.equipmentUsed}
            onChange={(event) => setForm((current) => ({ ...current, equipmentUsed: event.target.value }))}
            className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Kendala lapangan
          <textarea
            value={form.siteProblems}
            onChange={(event) => setForm((current) => ({ ...current, siteProblems: event.target.value }))}
            className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-slate-700">
          Catatan
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
          />
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
            <Camera size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Placeholder unggah foto</p>
            <input
              value={form.photoPlaceholder}
              onChange={(event) =>
                setForm((current) => ({ ...current, photoPlaceholder: event.target.value }))
              }
              placeholder="Contoh: Pengecoran kolom lantai 2 zona B"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>
      </div>

      {status ? <p className="mt-3 text-sm font-medium text-slate-600">{status}</p> : null}
    </form>
  );
}
