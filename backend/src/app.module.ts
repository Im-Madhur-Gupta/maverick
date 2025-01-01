import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'libs/prisma/src';
import { LoggerModule } from 'libs/logger/src';
import { AgentsModule } from './agents/agents.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    LoggerModule,
    AgentsModule,
    CronModule,
  ],
})
export class AppModule {}
