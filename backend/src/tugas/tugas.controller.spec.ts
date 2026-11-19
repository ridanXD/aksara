import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { TugasController } from './tugas.controller.js';
import { TugasService } from './tugas.service.js';
import { PrismaService } from '../prisma.service.js';

describe('TugasController', () => {
  let controller: TugasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TugasController],
      providers: [
        TugasService,
        {
          provide: PrismaService,
          useValue: {
            tugas: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              findFirst: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
              count: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<TugasController>(TugasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
