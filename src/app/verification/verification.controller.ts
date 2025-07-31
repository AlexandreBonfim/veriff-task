import { Controller, Post } from '@nestjs/common';
import { CreateVerificationUseCase } from './application/use-cases/create-verification.use-case';

@Controller('verifications')
export class VerificationController {
  constructor(private readonly createUseCase: CreateVerificationUseCase) {}

  @Post()
  async create() {
    const verification = await this.createUseCase.execute();
    return {
      id: verification.id,
      createdAt: verification.createdAt,
    };
  }
}
