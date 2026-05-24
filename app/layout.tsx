import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CiviTrack - Dasbor Manajemen Proyek Konstruksi",
  description: "Monitoring konstruksi cerdas untuk kendali proyek yang lebih baik."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
