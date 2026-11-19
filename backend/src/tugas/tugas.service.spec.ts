import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { TugasService } from './tugas.service.js';
import { PrismaService } from '../prisma.service.js';

describe('TugasService', () => {
  let service: TugasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TugasService>(TugasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
