import { Test } from '@nestjs/testing';
import { ImageProcessingService } from '../../services/image-processing.service';
import { UploadImageUseCase } from './upload-image.use-case';
import { PrismaService } from '../../../db/prisma.service';

describe('UploadImageUseCase', () => {
  let useCase: UploadImageUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UploadImageUseCase, PrismaService, ImageProcessingService],
    }).compile();

    useCase = module.get(UploadImageUseCase);
  });

  it('should throw if verification does not exist', async () => {
    await expect(
      useCase.execute('non-existent-id', {} as Express.Multer.File),
    ).rejects.toThrow();
  });

  // todo: add more cases - mock
});
