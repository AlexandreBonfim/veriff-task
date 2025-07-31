// src/verification/application/use-cases/create-verification.use-case.ts

import { Injectable } from '@nestjs/common';
import { Verification } from '../../domain/entities/verification.entity';
import { PrismaService } from '../../../db/prisma.service';

@Injectable()
export class CreateVerificationUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Verification> {
    const created = await this.prisma.verification.create({
      data: {},
    });

    return Verification.create(created.id, created.createdAt);
  }
}
