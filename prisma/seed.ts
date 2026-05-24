import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const date = (value: string) => new Date(`${value}T08:00:00.000Z`);

async function main() {
  await prisma.report.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.material.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.workItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "M. Dhafir Hawari",
        email: "admin@civitrack.test",
        password: "admin123",
        role: "ADMIN",
        position: "Administrator Sistem"
      },
      {
        name: "M. Dhafir Hawari",
        email: "manager@civitrack.test",
        password: "manager123",
        role: "PROJECT_MANAGER",
        position: "Manajer Proyek"
      },
      {
        name: "M. Dhafir Hawari",
        email: "engineer@civitrack.test",
        password: "engineer123",
        role: "SITE_ENGINEER",
        position: "Site Engineer"
      },
      {
        name: "M. Dhafir Hawari",
        email: "owner@civitrack.test",
        password: "owner123",
        role: "OWNER",
        position: "Perwakilan Pemilik"
      }
    ]
  });

  const labProject = await prisma.project.create({
    data: {
      name: "Pembangunan Gedung Laboratorium Teknik",
      location: "Makassar, Indonesia",
      client: "M. Dhafir Hawari",
      startDate: date("2026-01-08"),
      endDate: date("2026-09-30"),
      totalBudget: 1250000000,
      description:
        "Pembangunan gedung laboratorium teknik 3 lantai meliputi pekerjaan persiapan, tanah, pondasi, struktur beton bertulang, arsitektur, MEP, dan finishing.",
      status: "AT_RISK",
      overallProgress: 64
    }
  });

  const drainageProject = await prisma.project.create({
    data: {
      name: "Rehabilitasi Drainase Kawasan Perumahan",
      location: "Gowa, Indonesia",
      client: "M. Dhafir Hawari",
      startDate: date("2026-02-14"),
      endDate: date("2026-07-20"),
      totalBudget: 620000000,
      description:
        "Normalisasi saluran, pemasangan U-ditch, pekerjaan inlet, dan pemulihan akses warga pada kawasan perumahan padat.",
      status: "IN_PROGRESS",
      overallProgress: 48
    }
  });

  const bridgeProject = await prisma.project.create({
    data: {
      name: "Perencanaan Jembatan Beton Prategang",
      location: "Maros, Indonesia",
      client: "M. Dhafir Hawari",
      startDate: date("2026-05-01"),
      endDate: date("2026-12-15"),
      totalBudget: 2140000000,
      description:
        "Pekerjaan desain detail, persiapan lapangan, abutment, girder beton prategang, dan pengujian beban jembatan.",
      status: "PLANNED",
      overallProgress: 12
    }
  });

  await prisma.workItem.createMany({
    data: [
      {
        projectId: labProject.id,
        category: "Pekerjaan Persiapan",
        name: "Pembersihan lahan, bouwplank, direksi keet",
        weight: 5,
        targetProgress: 100,
        actualProgress: 100,
        startDate: date("2026-01-08"),
        deadline: date("2026-01-28"),
        status: "COMPLETED"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Tanah",
        name: "Galian tanah pondasi dan pemadatan lantai kerja",
        weight: 8,
        targetProgress: 100,
        actualProgress: 96,
        startDate: date("2026-01-29"),
        deadline: date("2026-02-25"),
        status: "COMPLETED"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Pondasi",
        name: "Pondasi footplat dan sloof beton bertulang",
        weight: 14,
        targetProgress: 100,
        actualProgress: 88,
        startDate: date("2026-02-26"),
        deadline: date("2026-03-29"),
        status: "DELAYED"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Struktur",
        name: "Kolom, balok, pelat lantai 1-3",
        weight: 28,
        targetProgress: 72,
        actualProgress: 58,
        startDate: date("2026-03-18"),
        deadline: date("2026-06-30"),
        status: "IN_PROGRESS"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Dinding",
        name: "Pasangan bata ringan dan plester aci",
        weight: 12,
        targetProgress: 46,
        actualProgress: 32,
        startDate: date("2026-05-12"),
        deadline: date("2026-07-18"),
        status: "IN_PROGRESS"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Atap",
        name: "Rangka baja ringan dan penutup atap",
        weight: 7,
        targetProgress: 20,
        actualProgress: 8,
        startDate: date("2026-06-01"),
        deadline: date("2026-07-08"),
        status: "PLANNED"
      },
      {
        projectId: labProject.id,
        category: "Pekerjaan Finishing",
        name: "Keramik, pengecatan, plafon, pintu dan jendela",
        weight: 18,
        targetProgress: 10,
        actualProgress: 4,
        startDate: date("2026-07-01"),
        deadline: date("2026-09-12"),
        status: "PLANNED"
      },
      {
        projectId: labProject.id,
        category: "MEP",
        name: "Instalasi listrik, plumbing, fire alarm, dan HVAC",
        weight: 8,
        targetProgress: 22,
        actualProgress: 12,
        startDate: date("2026-05-24"),
        deadline: date("2026-09-20"),
        status: "IN_PROGRESS"
      }
    ]
  });

  await prisma.dailyReport.createMany({
    data: [
      {
        projectId: labProject.id,
        reportDate: date("2026-05-15"),
        weather: "Cerah berawan",
        workerCount: 42,
        workCompletedToday:
          "Pengecoran kolom lantai 2 zona B, pembesian balok induk, dan pemasangan bekisting pelat.",
        materialUsed: "Semen 95 sak, besi D16 720 kg, pasir 9 m3, kerikil 11 m3",
        equipmentUsed: "Concrete mixer, bar cutter, perancah, vibrator beton",
        siteProblems:
          "Keterlambatan pengiriman besi D13 membuat pekerjaan pembesian balok anak tertahan 4 jam.",
        notes: "Koordinasi ulang jadwal supplier dan penambahan shift sore untuk area struktur.",
        photoPlaceholder: "Area pengecoran lantai 2 zona B"
      },
      {
        projectId: labProject.id,
        reportDate: date("2026-05-16"),
        weather: "Hujan ringan",
        workerCount: 38,
        workCompletedToday:
          "Perapihan bekisting, curing beton kolom, dan pemasangan bata ringan area laboratorium material.",
        materialUsed: "Bata ringan 420 pcs, mortar 38 sak, air curing 1 tangki",
        equipmentUsed: "Perancah, alat tangan, pompa air",
        siteProblems:
          "Hujan ringan membuat area kerja sisi timur licin dan perlu pembersihan tambahan.",
        notes: "Penerapan housekeeping setiap akhir shift diperketat oleh site engineer.",
        photoPlaceholder: "Pemasangan bata ringan sisi timur"
      },
      {
        projectId: labProject.id,
        reportDate: date("2026-05-17"),
        weather: "Cerah",
        workerCount: 45,
        workCompletedToday:
          "Pembesian balok anak, pemasangan jalur conduit awal, dan inspeksi verticality kolom.",
        materialUsed: "Besi D13 610 kg, kawat bendrat 18 kg, conduit 160 m",
        equipmentUsed: "Bar bender, total station, perancah",
        siteProblems:
          "Kebutuhan pekerja pembesian bertambah karena target struktur mingguan belum tercapai.",
        notes: "Mandor struktur mengajukan tambahan 6 tukang besi mulai pekan depan.",
        photoPlaceholder: "Inspeksi pembesian balok anak"
      }
    ]
  });

  await prisma.material.createMany({
    data: [
      {
        projectId: labProject.id,
        name: "Semen",
        unit: "sak",
        initialStock: 850,
        incomingStock: 460,
        usedStock: 990,
        remainingStock: 320,
        status: "SAFE"
      },
      {
        projectId: labProject.id,
        name: "Pasir",
        unit: "m3",
        initialStock: 120,
        incomingStock: 80,
        usedStock: 154,
        remainingStock: 46,
        status: "LOW_STOCK"
      },
      {
        projectId: labProject.id,
        name: "Kerikil",
        unit: "m3",
        initialStock: 135,
        incomingStock: 90,
        usedStock: 161,
        remainingStock: 64,
        status: "SAFE"
      },
      {
        projectId: labProject.id,
        name: "Besi Tulangan",
        unit: "kg",
        initialStock: 18500,
        incomingStock: 6200,
        usedStock: 22350,
        remainingStock: 2350,
        status: "LOW_STOCK"
      },
      {
        projectId: labProject.id,
        name: "Bata Ringan",
        unit: "pcs",
        initialStock: 9000,
        incomingStock: 2500,
        usedStock: 7180,
        remainingStock: 4320,
        status: "SAFE"
      },
      {
        projectId: labProject.id,
        name: "Cat",
        unit: "pail",
        initialStock: 0,
        incomingStock: 0,
        usedStock: 0,
        remainingStock: 0,
        status: "OUT_OF_STOCK"
      },
      {
        projectId: labProject.id,
        name: "Keramik",
        unit: "m2",
        initialStock: 0,
        incomingStock: 420,
        usedStock: 35,
        remainingStock: 385,
        status: "SAFE"
      }
    ]
  });

  await prisma.cost.createMany({
    data: [
      {
        projectId: labProject.id,
        category: "Material",
        description: "Pembelian semen, pasir, kerikil, dan besi tulangan tahap 4",
        date: date("2026-05-10"),
        amount: 372000000,
        notes: "Termasuk biaya bongkar dan pengujian material masuk."
      },
      {
        projectId: labProject.id,
        category: "Tenaga Kerja",
        description: "Upah tenaga kerja struktur dan finishing periode Mei minggu 2",
        date: date("2026-05-14"),
        amount: 148500000,
        notes: "Termasuk lembur pengecoran malam."
      },
      {
        projectId: labProject.id,
        category: "Alat Berat",
        description: "Sewa concrete pump, vibrator, dan scaffolding tambahan",
        date: date("2026-05-12"),
        amount: 82000000,
        notes: "Durasi sewa 14 hari kerja."
      },
      {
        projectId: labProject.id,
        category: "Transportasi",
        description: "Mobilisasi material dari supplier ke site",
        date: date("2026-05-11"),
        amount: 31500000,
        notes: "Termasuk rit tambahan karena akses jalan sempit."
      },
      {
        projectId: labProject.id,
        category: "Subkontraktor",
        description: "Termin awal subcontractor instalasi listrik dan plumbing",
        date: date("2026-05-09"),
        amount: 116000000,
        notes: "Pekerjaan rough-in MEP lantai 1."
      },
      {
        projectId: labProject.id,
        category: "Biaya Tak Terduga",
        description: "Perbaikan drainase sementara akibat genangan area timur",
        date: date("2026-05-16"),
        amount: 18250000,
        notes: "Pekerjaan darurat untuk menjaga produktivitas lapangan."
      }
    ]
  });

  await prisma.worker.createMany({
    data: [
      {
        projectId: labProject.id,
        name: "Herman L.",
        position: "Mandor",
        dailyWage: 220000,
        workingDays: 22,
        totalWage: 4840000,
        attendanceStatus: "PRESENT"
      },
      {
        projectId: labProject.id,
        name: "Fajar Rahman",
        position: "Tukang",
        dailyWage: 175000,
        workingDays: 21,
        totalWage: 3675000,
        attendanceStatus: "PRESENT"
      },
      {
        projectId: labProject.id,
        name: "Sultan Akbar",
        position: "Kenek",
        dailyWage: 130000,
        workingDays: 20,
        totalWage: 2600000,
        attendanceStatus: "HALF_DAY"
      },
      {
        projectId: labProject.id,
        name: "Baharuddin",
        position: "Operator Alat",
        dailyWage: 240000,
        workingDays: 18,
        totalWage: 4320000,
        attendanceStatus: "PRESENT"
      },
      {
        projectId: labProject.id,
        name: "M. Dhafir Hawari",
        position: "Site Engineer",
        dailyWage: 350000,
        workingDays: 22,
        totalWage: 7700000,
        attendanceStatus: "PRESENT"
      }
    ]
  });

  await prisma.schedule.createMany({
    data: [
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Persiapan",
        startDate: date("2026-01-08"),
        endDate: date("2026-01-28"),
        progress: 100,
        status: "COMPLETED",
        isDelayed: false
      },
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Tanah",
        startDate: date("2026-01-29"),
        endDate: date("2026-02-25"),
        progress: 96,
        status: "COMPLETED",
        isDelayed: false
      },
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Pondasi",
        startDate: date("2026-02-26"),
        endDate: date("2026-03-29"),
        progress: 88,
        status: "DELAYED",
        isDelayed: true
      },
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Struktur",
        startDate: date("2026-03-18"),
        endDate: date("2026-06-30"),
        progress: 58,
        status: "IN_PROGRESS",
        isDelayed: true
      },
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Dinding",
        startDate: date("2026-05-12"),
        endDate: date("2026-07-18"),
        progress: 32,
        status: "IN_PROGRESS",
        isDelayed: false
      },
      {
        projectId: labProject.id,
        workItem: "MEP",
        startDate: date("2026-05-24"),
        endDate: date("2026-09-20"),
        progress: 12,
        status: "IN_PROGRESS",
        isDelayed: false
      },
      {
        projectId: labProject.id,
        workItem: "Pekerjaan Finishing",
        startDate: date("2026-07-01"),
        endDate: date("2026-09-12"),
        progress: 4,
        status: "PLANNED",
        isDelayed: false
      }
    ]
  });

  await prisma.risk.createMany({
    data: [
      {
        projectId: labProject.id,
        title: "Keterlambatan pengiriman besi tulangan",
        level: "HIGH",
        impact:
          "Pekerjaan struktur lantai 2 berpotensi mundur 5-7 hari jika stok D13 dan D16 tidak stabil.",
        cause: "Supplier mengalami antrean produksi dan keterbatasan armada pengiriman.",
        recommendedAction:
          "Amankan purchase order tambahan, siapkan supplier cadangan, dan prioritaskan zona struktur kritis.",
        status: "OPEN"
      },
      {
        projectId: labProject.id,
        title: "Cuaca buruk",
        level: "MEDIUM",
        impact:
          "Produktivitas pengecoran dan pekerjaan dinding area terbuka menurun saat hujan.",
        cause: "Intensitas hujan sore meningkat selama periode transisi musim.",
        recommendedAction:
          "Geser pekerjaan outdoor ke pagi hari dan siapkan terpal pelindung material.",
        status: "IN_REVIEW"
      },
      {
        projectId: labProject.id,
        title: "Kekurangan tenaga kerja",
        level: "MEDIUM",
        impact:
          "Target mingguan pembesian dan bekisting sulit tercapai tanpa tambahan tenaga terampil.",
        cause: "Sebagian tukang dipindahkan sementara ke proyek lain oleh subkontraktor.",
        recommendedAction:
          "Tambah 6 tukang besi dan 4 pekerja bekisting selama dua minggu.",
        status: "OPEN"
      },
      {
        projectId: labProject.id,
        title: "Kenaikan harga material",
        level: "HIGH",
        impact:
          "Biaya aktual material dapat melewati baseline jika pembelian finishing ditunda terlalu lama.",
        cause: "Harga besi dan keramik mengalami kenaikan bertahap dari distributor.",
        recommendedAction:
          "Kunci harga material prioritas melalui kontrak pasokan dan evaluasi value engineering.",
        status: "IN_REVIEW"
      },
      {
        projectId: labProject.id,
        title: "Perubahan desain",
        level: "LOW",
        impact:
          "Revisi layout laboratorium material dapat menambah pekerjaan MEP dan partisi.",
        cause: "Pengguna meminta penambahan titik listrik dan exhaust pada ruang uji.",
        recommendedAction:
          "Validasi shop drawing revisi sebelum pekerjaan dinding ditutup.",
        status: "RESOLVED"
      }
    ]
  });

  await prisma.report.createMany({
    data: [
      {
        projectId: labProject.id,
        type: "DAILY",
        title: "Laporan Harian Lapangan - 17 Mei 2026",
        periodStart: date("2026-05-17"),
        periodEnd: date("2026-05-17"),
        summary:
          "Pekerjaan pembesian balok anak dan conduit awal berjalan, tetapi masih membutuhkan tambahan tenaga pembesian.",
        content:
          "Cuaca cerah, 45 pekerja hadir. Area struktur lantai 2 menjadi prioritas. Kendala utama adalah ketersediaan tenaga tukang besi dan koordinasi material D13."
      },
      {
        projectId: labProject.id,
        type: "WEEKLY_PROGRESS",
        title: "Laporan Progres Mingguan - Minggu 20",
        periodStart: date("2026-05-11"),
        periodEnd: date("2026-05-17"),
        summary:
          "Progres aktual 64% terhadap target 72%. Deviasi terbesar berada pada pekerjaan struktur dan pondasi.",
        content:
          "Pekerjaan struktur mencapai 58%, dinding 32%, dan MEP 12%. Rekomendasi: percepat pembesian zona B, tambah shift sore, dan pastikan material struktur tersedia sebelum jadwal pengecoran."
      },
      {
        projectId: labProject.id,
        type: "MATERIAL_USAGE",
        title: "Laporan Pemakaian Material - Mei 2026",
        periodStart: date("2026-05-01"),
        periodEnd: date("2026-05-17"),
        summary:
          "Besi tulangan dan pasir memasuki status low stock, sedangkan cat belum tersedia untuk fase finishing.",
        content:
          "Pemakaian terbesar: besi tulangan 22.350 kg, semen 990 sak, dan bata ringan 7.180 pcs. Pengadaan ulang besi dan pasir perlu diprioritaskan dalam 7 hari."
      },
      {
        projectId: labProject.id,
        type: "COST",
        title: "Laporan Biaya - Mei 2026",
        periodStart: date("2026-05-01"),
        periodEnd: date("2026-05-17"),
        summary:
          "Total biaya aktual tercatat Rp 768.250.000 atau sekitar 61,46% dari total anggaran.",
        content:
          "Kategori material menjadi komponen biaya terbesar. Biaya tak terduga muncul dari perbaikan drainase sementara. Sisa anggaran masih cukup, tetapi risiko kenaikan harga material harus dikendalikan."
      },
      {
        projectId: labProject.id,
        type: "FINAL_SUMMARY",
        title: "Ringkasan Akhir Proyek - Draft",
        periodStart: date("2026-01-08"),
        periodEnd: date("2026-09-30"),
        summary:
          "Draft ringkasan akhir akan diperbarui setelah seluruh pekerjaan struktur, finishing, dan MEP selesai.",
        content:
          "Dokumen ini disiapkan sebagai template laporan akhir proyek: lingkup pekerjaan, realisasi biaya, deviasi jadwal, quality control, dokumentasi, dan rekomendasi pemeliharaan."
      }
    ]
  });

  await prisma.workItem.createMany({
    data: [
      {
        projectId: drainageProject.id,
        category: "Pekerjaan Saluran",
        name: "Pemasangan U-ditch segmen 1",
        weight: 42,
        targetProgress: 55,
        actualProgress: 48,
        startDate: date("2026-03-01"),
        deadline: date("2026-06-05"),
        status: "IN_PROGRESS"
      },
      {
        projectId: bridgeProject.id,
        category: "Pekerjaan Desain",
        name: "Review desain girder prategang",
        weight: 18,
        targetProgress: 20,
        actualProgress: 12,
        startDate: date("2026-05-01"),
        deadline: date("2026-06-15"),
        status: "PLANNED"
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
