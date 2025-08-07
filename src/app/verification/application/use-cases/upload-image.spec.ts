import { Test } from '@nestjs/testing';
import { UploadImageUseCase } from './upload-image.use-case';
import { PrismaService } from '../../../db/prisma.service';
import { ImageProcessingService } from '../../services/image-processing.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UploadImageUseCase', () => {
  let useCase: UploadImageUseCase;

  const mockPrisma = {
    verification: {
      findUnique: jest.fn(),
    },
    image: {
      create: jest.fn(),
    },
  };

  const mockProcessor = {
    processAndStoreFaces: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UploadImageUseCase,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ImageProcessingService, useValue: mockProcessor },
      ],
    }).compile();

    useCase = module.get(UploadImageUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if verification does not exist', async () => {
    mockPrisma.verification.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-id', {} as Express.Multer.File),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if more than 5 images already exist', async () => {
    mockPrisma.verification.findUnique.mockResolvedValue({
      images: [{}, {}, {}, {}, {}, {}], // 6 images
    });

    await expect(
      useCase.execute('valid-id', {} as Express.Multer.File),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create an image and process face encodings', async () => {
    const file = {
      buffer: Buffer.from('fake-image'),
      originalname: 'image.jpg',
    } as Express.Multer.File;

    mockPrisma.verification.findUnique.mockResolvedValue({
      id: 'verif-1',
      images: [],
    });

    mockPrisma.image.create.mockResolvedValue({
      id: 'image-1',
      createdAt: new Date('2025-08-05T00:00:00Z'),
    });

    const result = await useCase.execute('verif-1', file);

    expect(mockPrisma.verification.findUnique).toHaveBeenCalledWith({
      where: { id: 'verif-1' },
      include: { images: true },
    });

    expect(mockPrisma.image.create).toHaveBeenCalledWith({
      data: {
        verificationId: 'verif-1',
      },
    });

    expect(mockProcessor.processAndStoreFaces).toHaveBeenCalledWith(
      'image-1',
      file.buffer,
      file.originalname,
    );

    expect(result).toEqual({
      id: 'image-1',
      createdAt: new Date('2025-08-05T00:00:00Z'),
    });
  });
});
