import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [PrismaModule, VerificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
