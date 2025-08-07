import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../db/prisma.service';
import { GetVerificationSummaryUseCase } from './get-summary.use-case';
import { NotFoundException } from '@nestjs/common';

describe('GetVerificationSummaryUseCase', () => {
  let useCase: GetVerificationSummaryUseCase;

  const mockPrisma = {
    verification: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetVerificationSummaryUseCase,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    useCase = module.get(GetVerificationSummaryUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw NotFoundException if verification does not exist', async () => {
    mockPrisma.verification.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return all face encodings from a verification', async () => {
    mockPrisma.verification.findUnique.mockResolvedValue({
      id: 'test-verification-id',
      images: [
        {
          faceEncodings: [
            { vector: [0.1, 0.2, 0.3] },
            { vector: [0.4, 0.5, 0.6] },
          ],
        },
        {
          faceEncodings: [{ vector: [0.7, 0.8, 0.9] }],
        },
      ],
    });

    const result = await useCase.execute('test-verification-id');

    expect(result).toEqual([
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
      [0.7, 0.8, 0.9],
    ]);
  });
});
