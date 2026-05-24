"use client";

import Link from "next/link";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate, statusLabel } from "@/lib/utils";

export type ProjectDTO = {
  id: string;
  name: string;
  location: string;
  client: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  description: string;
  status: string;
  overallProgress: number;
};

type ProjectManagerProps = {
  initialProjects: ProjectDTO[];
  canManage: boolean;
};

const blankProject: Omit<ProjectDTO, "id"> = {
  name: "",
  location: "",
  client: "M. Dhafir Hawari",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString().slice(0, 10),
  totalBudget: 0,
  description: "",
  status: "PLANNED",
  overallProgress: 0
};

const statusOptions = ["PLANNED", "IN_PROGRESS", "AT_RISK", "COMPLETED", "ON_HOLD"];

function normalizeDate(value: string) {
  return value.slice(0, 10);
}

export function ProjectManager({ initialProjects, canManage }: ProjectManagerProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ProjectDTO, "id">>(blankProject);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedQuery ||
        `${project.name} ${project.location} ${project.client} ${project.description}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, query, statusFilter]);

  function startCreate() {
    setEditingId(null);
    setForm(blankProject);
    setMessage(null);
  }

  function startEdit(project: ProjectDTO) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      location: project.location,
      client: project.client,
      startDate: normalizeDate(project.startDate),
      endDate: normalizeDate(project.endDate),
      totalBudget: project.totalBudget,
      description: project.description,
      status: project.status,
      overallProgress: project.overallProgress
    });
    setMessage(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setMessage("Proyek belum bisa disimpan. Periksa peran dan isi formulir.");
      setSaving(false);
      return;
    }

    const saved = (await response.json()) as ProjectDTO;
    setProjects((current) =>
      editingId
        ? current.map((project) => (project.id === saved.id ? saved : project))
        : [saved, ...current]
    );
    setEditingId(saved.id);
    setSaving(false);
    setMessage("Proyek berhasil disimpan.");
    router.refresh();
  }

  async function deleteProject(id: string) {
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setMessage("Proyek belum bisa dihapus.");
      return;
    }

    setProjects((current) => current.filter((project) => project.id !== id));
    if (editingId === id) startCreate();
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950">Portofolio Proyek</h2>
            <p className="text-sm text-slate-500">Cari dan filter data proyek konstruksi.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari proyek..."
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-amberline-500"
            >
              <option value="all">Semua status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
            {canManage ? (
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amberline-500 px-4 py-2.5 text-sm font-black text-navy-950 shadow-sm shadow-amberline-500/20 transition hover:bg-amberline-400"
              >
                <Plus size={16} />
                Tambah Proyek
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Proyek
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Anggaran
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Progres
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-semibold text-navy-700 hover:text-amberline-600"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.location} - {project.client}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">
                    {formatCurrency(project.totalBudget)}
                  </td>
                  <td className="min-w-48 px-4 py-4">
                    <ProgressBar value={project.overallProgress} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <StatusBadge value={project.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    {canManage ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(project)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                          aria-label={`Edit ${project.name}`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(project.id)}
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Hapus ${project.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Hanya lihat</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="mx-auto max-w-sm rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
                      <p className="text-sm font-bold text-slate-800">
                        Data proyek tidak ditemukan
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Ubah kata kunci atau status filter untuk menampilkan proyek lain.
                      </p>
                      {canManage ? (
                        <button
                          type="button"
                          onClick={startCreate}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
                        >
                          <Plus size={16} />
                          Tambah Proyek Baru
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              {editingId ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h2>
            <p className="text-sm text-slate-500">
              {canManage
                ? "Isi data proyek baru atau perbarui data proyek yang sudah ada."
                : "Peran Anda hanya dapat melihat data proyek."}
            </p>
          </div>
          {canManage ? (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:border-amberline-300 hover:bg-amber-50"
              aria-label={editingId ? "Batalkan edit dan buat proyek baru" : "Buat proyek baru"}
            >
              {editingId ? <X size={16} /> : <Plus size={16} />}
              <span>{editingId ? "Batal Edit" : "Baru"}</span>
            </button>
          ) : null}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Nama proyek
            <input
              disabled={!canManage}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Lokasi
              <input
                disabled={!canManage}
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({ ...current, location: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Klien / pemilik
              <input
                disabled={!canManage}
                value={form.client}
                onChange={(event) =>
                  setForm((current) => ({ ...current, client: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Tanggal mulai
              <input
                disabled={!canManage}
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, startDate: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Tanggal selesai
              <input
                disabled={!canManage}
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, endDate: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Total anggaran
              <input
                disabled={!canManage}
                type="number"
                min="0"
                value={form.totalBudget}
                onChange={(event) =>
                  setForm((current) => ({ ...current, totalBudget: Number(event.target.value) }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Progres keseluruhan
              <input
                disabled={!canManage}
                type="number"
                min="0"
                max="100"
                value={form.overallProgress}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    overallProgress: Number(event.target.value)
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Status
              <select
                disabled={!canManage}
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Deskripsi
            <textarea
              disabled={!canManage}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-amberline-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
              required
            />
          </label>

          {canManage ? (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambahkan Proyek"}
            </button>
          ) : null}
        </form>

        {message ? <p className="mt-3 text-sm font-medium text-slate-600">{message}</p> : null}
      </section>
    </div>
  );
}
