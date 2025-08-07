import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { PrismaService } from '../../db/prisma.service';

type FaceEncodingVector = number[];
type FaceEncodingResponse = FaceEncodingVector[];

@Injectable()
export class ImageProcessingService {
  private readonly faceApiUrl = process.env.FACE_ENCODER_API_URL;

  constructor(private readonly prisma: PrismaService) {}

  async processAndStoreFaces(
    imageId: string,
    buffer: Buffer,
    filename: string,
  ): Promise<void> {
    const form = new FormData();
    form.append('file', buffer, filename);

    const response = await axios.post<FaceEncodingResponse>(
      this.faceApiUrl!,
      form,
      { headers: form.getHeaders() },
    );

    const vectors = response.data;

    if (!vectors.length) {
      console.warn(`No face encodings found for image: ${filename}`);
      return;
    }

    for (const vector of vectors) {
      await this.prisma.faceEncoding.create({
        data: {
          imageId,
          vector,
        },
      });
    }
  }
}
