import { Test } from '@nestjs/testing';
import { CreateVerificationUseCase } from './create-verification.use-case';
import { PrismaService } from '../../../db/prisma.service';
import { Verification } from '../../domain/entities/verification.entity';

describe('CreateVerificationUseCase', () => {
  let useCase: CreateVerificationUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CreateVerificationUseCase, PrismaService],
    }).compile();

    useCase = module.get(CreateVerificationUseCase);
  });

  it('should create a verification container', async () => {
    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Verification);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
