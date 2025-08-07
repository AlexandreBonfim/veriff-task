jest.mock('axios', () => ({
  post: jest.fn(),
}));

import axios from 'axios';
import { Test } from '@nestjs/testing';
import { ImageProcessingService } from './image-processing.service';
import { PrismaService } from '../../db/prisma.service';

describe('ImageProcessingService', () => {
  let service: ImageProcessingService;

  const mockPrisma = {
    faceEncoding: {
      create: jest.fn(),
    },
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const mockedAxiosPost = axios.post as jest.Mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ImageProcessingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(ImageProcessingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should store face vectors', async () => {
    mockedAxiosPost.mockResolvedValue({
      data: [[0.1, 0.2, 0.3]],
    });

    await service.processAndStoreFaces(
      'img-id',
      Buffer.from('test'),
      'face.jpg',
    );

    expect(mockedAxiosPost).toHaveBeenCalled();
    expect(mockPrisma.faceEncoding.create).toHaveBeenCalledTimes(1);
  });

  it('should skip storing if no faces', async () => {
    mockedAxiosPost.mockResolvedValue({ data: [] });

    await service.processAndStoreFaces(
      'img-id',
      Buffer.from('test'),
      'noface.jpg',
    );

    expect(mockedAxiosPost).toHaveBeenCalled();
    expect(mockPrisma.faceEncoding.create).not.toHaveBeenCalled();
  });
});
