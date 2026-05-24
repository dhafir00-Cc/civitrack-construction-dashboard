"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Cetak / Simpan PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
    >
      <Printer size={16} />
      {label}
    </button>
  );
}
