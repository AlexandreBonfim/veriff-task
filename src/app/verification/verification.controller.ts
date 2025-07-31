import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateVerificationUseCase } from './application/use-cases/create-verification.use-case';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetVerificationSummaryUseCase } from './application/use-cases/get-summary.use-case';

@Controller('verifications')
export class VerificationController {
  constructor(
    private readonly createUseCase: CreateVerificationUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly summaryUseCase: GetVerificationSummaryUseCase,
  ) {}

  @Get(':id/summary')
  async getSummary(@Param('id') verificationId: string) {
    const faces = await this.summaryUseCase.execute(verificationId);
    return {
      verificationId,
      faces,
    };
  }

  @Post()
  async create() {
    const verification = await this.createUseCase.execute();
    return {
      id: verification.id,
      createdAt: verification.createdAt,
    };
  }

  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async uploadImage(
    @Param('id') verificationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = await this.uploadImageUseCase.execute(verificationId, file);
    return {
      id: image.id,
      createdAt: image.createdAt,
    };
  }
}
