import { Module } from '@nestjs/common';
import { CreateVerificationUseCase } from './application/use-cases/create-verification.use-case';
import { PrismaService } from '../db/prisma.service';
import { VerificationController } from './verification.controller';

@Module({
  controllers: [VerificationController],
  providers: [CreateVerificationUseCase, PrismaService],
})
export class VerificationModule {}
