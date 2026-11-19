import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TugasModule } from './tugas/tugas.module.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [TugasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
