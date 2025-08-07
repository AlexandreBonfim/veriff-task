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
import { GetVerificationSummaryUseCase } from './application/use-cases/get-summary.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationController {
  constructor(
    private readonly createUseCase: CreateVerificationUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly summaryUseCase: GetVerificationSummaryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new verification container' })
  async create() {
    const verification = await this.createUseCase.execute();
    return {
      id: verification.id,
      createdAt: verification.createdAt,
    };
  }

  @Post(':id/images')
  @ApiOperation({
    summary: 'Upload an image to a verification container (max 5)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Verification ID' })
  @ApiBody({
    description: 'Image file to process',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Fetch all face encodings for a given verification',
  })
  @ApiParam({ name: 'id', description: 'Verification ID' })
  async getSummary(@Param('id') verificationId: string) {
    const faces = await this.summaryUseCase.execute(verificationId);
    return {
      verificationId,
      faces,
    };
  }
}
