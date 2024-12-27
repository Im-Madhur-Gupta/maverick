import { Module } from '@nestjs/common';
import { PrismaModule } from 'libs/prisma/src';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
