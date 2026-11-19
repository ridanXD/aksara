import { Module } from '@nestjs/common';
import { TugasService } from './tugas.service.js';
import { TugasController } from './tugas.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [TugasController],
  providers: [TugasService, PrismaService],
})
export class TugasModule {}
