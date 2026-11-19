CREATE TABLE "tugas" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "mataKuliah" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Belum Dikerjakan',
    "prioritas" TEXT NOT NULL DEFAULT 'Sedang',
    "estimasiJam" INTEGER NOT NULL DEFAULT 2,
    "sudahSelesai" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tugas_pkey" PRIMARY KEY ("id")
);
