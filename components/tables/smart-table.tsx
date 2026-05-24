"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { displayLabel, formatCurrency, formatDate } from "@/lib/utils";

type RowValue = string | number | boolean | null | undefined;

export type SmartColumn = {
  key: string;
  header: string;
  type?: "text" | "currency" | "date" | "progress" | "status" | "risk" | "boolean";
  className?: string;
};

type SmartTableProps = {
  rows: Record<string, RowValue>[];
  columns: SmartColumn[];
  searchPlaceholder?: string;
  filterKey?: string;
  filterLabel?: string;
  linkBase?: string;
  linkKey?: string;
  emptyTitle?: string;
};

function renderCell(row: Record<string, RowValue>, column: SmartColumn) {
  const value = row[column.key];

  if (value === null || typeof value === "undefined" || value === "") {
    return <span className="text-slate-400">-</span>;
  }

  if (column.type === "currency") return formatCurrency(Number(value));
  if (column.type === "date") return formatDate(String(value));
  if (column.type === "progress") return <ProgressBar value={Number(value)} size="sm" />;
  if (column.type === "status") return <StatusBadge value={String(value)} />;
  if (column.type === "risk") return <StatusBadge value={String(value)} tone="risk" />;
  if (column.type === "boolean") {
    return value ? (
      <span className="font-semibold text-red-600">Terlambat</span>
    ) : (
      <span className="font-semibold text-emerald-600">Sesuai Rencana</span>
    );
  }

  return String(value);
}

export function SmartTable({
  rows,
  columns,
  searchPlaceholder = "Cari data...",
  filterKey,
  filterLabel = "Semua status",
  linkBase,
  linkKey = "id",
  emptyTitle = "Tidak ada data yang ditemukan"
}: SmartTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filterOptions = useMemo(() => {
    if (!filterKey) return [];

    return Array.from(
      new Set(rows.map((row) => String(row[filterKey])).filter(Boolean))
    ).sort();
  }, [filterKey, rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return rows.filter((row) => {
      const searchable = Object.values(row).join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesFilter =
        !filterKey || filter === "all" || String(row[filterKey]) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [filter, filterKey, query, rows]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 ring-1 ring-transparent transition focus-within:border-amberline-500 focus-within:bg-white focus-within:ring-amberline-100 md:max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {filterKey ? (
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-amberline-500"
          >
            <option value="all">{filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {displayLabel(option)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/90">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredRows.map((row, rowIndex) => (
              <tr
                key={String(row[linkKey] ?? rowIndex)}
                className="transition hover:bg-amber-50/30"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.key}
                    className={`max-w-[320px] whitespace-nowrap px-4 py-4 align-middle text-slate-700 ${column.className ?? ""}`}
                  >
                    {columnIndex === 0 && linkBase && row[linkKey] ? (
                      <Link
                        href={`${linkBase}/${row[linkKey]}`}
                        className="font-bold text-navy-700 hover:text-amberline-600"
                      >
                        {renderCell(row, column)}
                      </Link>
                    ) : (
                      renderCell(row, column)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRows.length === 0 ? (
        <div className="p-10 text-center text-sm font-medium text-slate-500">{emptyTitle}</div>
      ) : null}
    </div>
  );
}
