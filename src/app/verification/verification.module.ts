import { Module } from '@nestjs/common';
import { CreateVerificationUseCase } from './application/use-cases/create-verification.use-case';
import { PrismaService } from '../db/prisma.service';
import { VerificationController } from './verification.controller';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { GetVerificationSummaryUseCase } from './application/use-cases/get-summary.use-case';
import { ImageProcessingService } from './services/image-processing.service';

@Module({
  controllers: [VerificationController],
  providers: [
    CreateVerificationUseCase,
    UploadImageUseCase,
    GetVerificationSummaryUseCase,
    ImageProcessingService,
    PrismaService,
  ],
})
export class VerificationModule {}
