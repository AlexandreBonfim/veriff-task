import { Test } from '@nestjs/testing';
import { CreateVerificationUseCase } from './create-verification.use-case';
import { PrismaService } from '../../../db/prisma.service';
import { Verification } from '../../domain/entities/verification.entity';

describe('CreateVerificationUseCase', () => {
  let useCase: CreateVerificationUseCase;

  const mockPrisma = {
    verification: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateVerificationUseCase,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    useCase = module.get(CreateVerificationUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a verification container', async () => {
    const now = new Date();
    mockPrisma.verification.create.mockResolvedValue({
      id: 'mock-id',
      createdAt: now,
    });

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Verification);
    expect(result.id).toBe('mock-id');
    expect(result.createdAt).toBe(now);
  });
});
