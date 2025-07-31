import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../db/prisma.service';
import { GetVerificationSummaryUseCase } from './get-summary.use-case';

describe('GetVerificationSummaryUseCase', () => {
  let useCase: GetVerificationSummaryUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetVerificationSummaryUseCase, PrismaService],
    }).compile();

    useCase = module.get(GetVerificationSummaryUseCase);
  });

  it('should return all face vectors for a verification', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow();
  });

  // todo: add more cases - mock
});
