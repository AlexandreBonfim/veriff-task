import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { PrismaService } from '../../db/prisma.service';

type FaceEncodingVector = number[];
type FaceEncodingResponse = FaceEncodingVector[];

@Injectable()
export class ImageProcessingService {
  constructor(private readonly prisma: PrismaService) {}

  async processAndStoreFaces(
    imageId: string,
    buffer: Buffer,
    filename: string,
  ): Promise<void> {
    const form = new FormData();
    form.append('file', buffer, filename);

    const response = await axios.post<FaceEncodingResponse>(
      'http://localhost:8000/encode', // todo: create a cont file
      form,
      {
        headers: form.getHeaders(),
      },
    );

    for (const vector of response.data) {
      await this.prisma.faceEncoding.create({
        data: {
          imageId,
          vector,
        },
      });
    }
  }
}
