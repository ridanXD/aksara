import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto.js';
import { UpdateTugasDto } from './dto/update-tugas.dto.js';
import { Tugas } from './entities/tugas.entity.js';

@Injectable()
export class TugasService {
  private tugasList: Tugas[] = [
    {
      id: 1,
      judul: 'Tugas 2: Form HTML dan Validasi',
      mataKuliah: 'Pemrograman Web',
      deadline: '2026-10-30',
      status: 'Belum Dikerjakan',
      prioritas: 'Tinggi',
      estimasiJam: 4,
      sudahSelesai: false,
    },
    {
      id: 2,
      judul: 'Tugas 1: Desain Antarmuka Mobile',
      mataKuliah: 'Pemrograman Mobile',
      deadline: '2026-11-05',
      status: 'Sedang Dikerjakan',
      prioritas: 'Sedang',
      estimasiJam: 6,
      sudahSelesai: false,
    },
    {
      id: 3,
      judul: 'Tugas 3: ERD dan Normalisasi',
      mataKuliah: 'Basis Data',
      deadline: '2026-11-12',
      status: 'Belum Dikerjakan',
      prioritas: 'Rendah',
      estimasiJam: 3,
      sudahSelesai: false,
    },
  ];

  private nextId = 4;

  create(createTugasDto: CreateTugasDto): Tugas {
    const isDuplicate = this.tugasList.some(
      (t) =>
        t.judul.toLowerCase() === createTugasDto.judul.trim().toLowerCase() &&
        t.mataKuliah.toLowerCase() === createTugasDto.mataKuliah.trim().toLowerCase(),
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Tugas dengan judul "${createTugasDto.judul}" pada mata kuliah "${createTugasDto.mataKuliah}" sudah terdaftar`,
      );
    }

    const baru: Tugas = {
      id: this.nextId++,
      judul: createTugasDto.judul.trim(),
      mataKuliah: createTugasDto.mataKuliah.trim(),
      deadline: createTugasDto.deadline.trim(),
      status: createTugasDto.status || 'Belum Dikerjakan',
      prioritas: createTugasDto.prioritas || 'Sedang',
      estimasiJam: createTugasDto.estimasiJam ?? 2,
      sudahSelesai:
        createTugasDto.sudahSelesai !== undefined
          ? createTugasDto.sudahSelesai
          : createTugasDto.status === 'Selesai',
    };

    this.tugasList.push(baru);
    return baru;
  }

  findAll(): Tugas[] {
    return this.tugasList;
  }

  findOne(id: number): Tugas {
    const tugas = this.tugasList.find((t) => t.id === id);
    if (!tugas) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }
    return tugas;
  }

  update(id: number, updateTugasDto: UpdateTugasDto): Tugas {
    const index = this.tugasList.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }

    const current = this.tugasList[index];
    const targetJudul = updateTugasDto.judul ? updateTugasDto.judul.trim() : current.judul;
    const targetMataKuliah = updateTugasDto.mataKuliah ? updateTugasDto.mataKuliah.trim() : current.mataKuliah;

    const isDuplicate = this.tugasList.some(
      (t) =>
        t.id !== id &&
        t.judul.toLowerCase() === targetJudul.toLowerCase() &&
        t.mataKuliah.toLowerCase() === targetMataKuliah.toLowerCase(),
    );

    if (isDuplicate) {
      throw new ConflictException(
        `Tugas dengan judul "${targetJudul}" pada mata kuliah "${targetMataKuliah}" sudah terdaftar`,
      );
    }

    const newStatus = updateTugasDto.status ?? current.status;
    const newSudahSelesai =
      updateTugasDto.sudahSelesai !== undefined
        ? updateTugasDto.sudahSelesai
        : newStatus === 'Selesai';

    const updated: Tugas = {
      ...current,
      ...updateTugasDto,
      judul: targetJudul,
      mataKuliah: targetMataKuliah,
      status: newStatus,
      sudahSelesai: newSudahSelesai,
    };

    this.tugasList[index] = updated;
    return updated;
  }

  remove(id: number): { message: string; id: number } {
    const index = this.tugasList.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }

    this.tugasList.splice(index, 1);
    return {
      message: `Tugas dengan ID ${id} berhasil dihapus`,
      id,
    };
  }
}
