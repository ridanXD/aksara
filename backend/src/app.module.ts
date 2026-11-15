import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TugasModule } from './tugas/tugas.module.js';

@Module({
  imports: [TugasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
