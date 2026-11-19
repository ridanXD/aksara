import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateTugasDto } from './dto/create-tugas.dto.js';
import { UpdateTugasDto } from './dto/update-tugas.dto.js';
import { Tugas } from './entities/tugas.entity.js';

@Injectable()
export class TugasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTugasDto: CreateTugasDto): Promise<Tugas> {
    const isDuplicate = await this.prisma.tugas.findFirst({
      where: {
        judul: { equals: createTugasDto.judul.trim(), mode: 'insensitive' },
        mataKuliah: { equals: createTugasDto.mataKuliah.trim(), mode: 'insensitive' },
      },
    });

    if (isDuplicate) {
      throw new ConflictException(
        `Tugas dengan judul "${createTugasDto.judul}" pada mata kuliah "${createTugasDto.mataKuliah}" sudah terdaftar`,
      );
    }

    const status = createTugasDto.status || 'Belum Dikerjakan';
    const sudahSelesai =
      createTugasDto.sudahSelesai !== undefined
        ? createTugasDto.sudahSelesai
        : status === 'Selesai';

    return this.prisma.tugas.create({
      data: {
        judul: createTugasDto.judul.trim(),
        mataKuliah: createTugasDto.mataKuliah.trim(),
        deadline: createTugasDto.deadline.trim(),
        status,
        prioritas: createTugasDto.prioritas || 'Sedang',
        estimasiJam: createTugasDto.estimasiJam ?? 2,
        sudahSelesai,
      },
    });
  }

  async findAll(status?: string): Promise<Tugas[]> {
    if (status) {
      return this.prisma.tugas.findMany({
        where: { status },
        orderBy: { id: 'asc' },
      });
    }
    return this.prisma.tugas.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<Tugas> {
    const tugas = await this.prisma.tugas.findUnique({
      where: { id },
    });
    if (!tugas) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }
    return tugas;
  }

  async update(id: number, updateTugasDto: UpdateTugasDto): Promise<Tugas> {
    const current = await this.prisma.tugas.findUnique({
      where: { id },
    });
    if (!current) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }

    const targetJudul = updateTugasDto.judul ? updateTugasDto.judul.trim() : current.judul;
    const targetMataKuliah = updateTugasDto.mataKuliah ? updateTugasDto.mataKuliah.trim() : current.mataKuliah;

    const isDuplicate = await this.prisma.tugas.findFirst({
      where: {
        id: { not: id },
        judul: { equals: targetJudul, mode: 'insensitive' },
        mataKuliah: { equals: targetMataKuliah, mode: 'insensitive' },
      },
    });

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

    return this.prisma.tugas.update({
      where: { id },
      data: {
        ...(updateTugasDto.judul !== undefined && { judul: targetJudul }),
        ...(updateTugasDto.mataKuliah !== undefined && { mataKuliah: targetMataKuliah }),
        ...(updateTugasDto.deadline !== undefined && { deadline: updateTugasDto.deadline.trim() }),
        ...(updateTugasDto.status !== undefined && { status: newStatus }),
        ...(updateTugasDto.prioritas !== undefined && { prioritas: updateTugasDto.prioritas }),
        ...(updateTugasDto.estimasiJam !== undefined && { estimasiJam: updateTugasDto.estimasiJam }),
        sudahSelesai: newSudahSelesai,
      },
    });
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const current = await this.prisma.tugas.findUnique({
      where: { id },
    });
    if (!current) {
      throw new NotFoundException(`Tugas dengan ID ${id} tidak ditemukan`);
    }

    await this.prisma.tugas.delete({
      where: { id },
    });

    return {
      message: `Tugas dengan ID ${id} berhasil dihapus`,
      id,
    };
  }

  async getStatistik() {
    const total = await this.prisma.tugas.count();
    const selesai = await this.prisma.tugas.count({
      where: { status: 'Selesai' },
    });
    const sedangDikerjakan = await this.prisma.tugas.count({
      where: { status: 'Sedang Dikerjakan' },
    });
    const belumDikerjakan = await this.prisma.tugas.count({
      where: { status: 'Belum Dikerjakan' },
    });

    return {
      total,
      selesai,
      sedangDikerjakan,
      belumDikerjakan,
    };
  }
}
