import { Module } from '@nestjs/common';
import { PrismaModule } from 'libs/prisma/src';
import { LoggerModule } from 'libs/logger/src';
import { AgentsModule } from './agents/agents.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LoggerModule,
    AgentsModule,
  ],
})
export class AppModule {}
