import { Module } from '@nestjs/common';
import { TugasService } from './tugas.service.js';
import { TugasController } from './tugas.controller.js';

@Module({
  controllers: [TugasController],
  providers: [TugasService],
})
export class TugasModule {}
