import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';

@Injectable()
export class GetVerificationSummaryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(verificationId: string): Promise<number[][]> {
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
      include: {
        images: {
          include: {
            faceEncodings: true,
          },
        },
      },
    });

    if (!verification) throw new NotFoundException('Verification not found');

    const allVectors: number[][] = [];

    for (const image of verification.images) {
      for (const encoding of image.faceEncodings) {
        allVectors.push(encoding.vector);
      }
    }

    return allVectors;
  }
}
