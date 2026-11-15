import { Test, TestingModule } from '@nestjs/testing';
import { TugasController } from './tugas.controller.js';
import { TugasService } from './tugas.service.js';

describe('TugasController', () => {
  let controller: TugasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TugasController],
      providers: [TugasService],
    }).compile();

    controller = module.get<TugasController>(TugasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
