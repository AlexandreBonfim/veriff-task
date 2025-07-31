import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Image } from '../../domain/entities/image.entity';
import { ImageProcessingService } from '../../services/image-processing.service';
import { PrismaService } from '../../../db/prisma.service';

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly processor: ImageProcessingService,
  ) {}

  async execute(
    verificationId: string,
    file: Express.Multer.File,
  ): Promise<Image> {
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
      include: { images: true },
    });

    if (!verification) throw new NotFoundException('Verification not found');
    if (verification.images.length >= 5)
      throw new BadRequestException('Maximum 5 images allowed');

    const createdImage = await this.prisma.image.create({
      data: {
        verificationId,
      },
    });

    // Call external encoding service
    await this.processor.processAndStoreFaces(
      createdImage.id,
      file.buffer,
      file.originalname,
    );

    return Image.create(createdImage.id, createdImage.createdAt);
  }
}
