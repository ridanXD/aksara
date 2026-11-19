import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.tugas.count();
  if (count === 0) {
    await prisma.tugas.createMany({
      data: [
        {
          judul: 'Tugas 2: Form HTML dan Validasi',
          mataKuliah: 'Pemrograman Web',
          deadline: '2026-10-30',
          status: 'Belum Dikerjakan',
          prioritas: 'Tinggi',
          estimasiJam: 4,
          sudahSelesai: false,
        },
        {
          judul: 'Tugas 1: Desain Antarmuka Mobile',
          mataKuliah: 'Pemrograman Mobile',
          deadline: '2026-11-05',
          status: 'Sedang Dikerjakan',
          prioritas: 'Sedang',
          estimasiJam: 6,
          sudahSelesai: false,
        },
        {
          judul: 'Tugas 3: ERD dan Normalisasi',
          mataKuliah: 'Basis Data',
          deadline: '2026-11-12',
          status: 'Belum Dikerjakan',
          prioritas: 'Rendah',
          estimasiJam: 3,
          sudahSelesai: false,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
