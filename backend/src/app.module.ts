import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'libs/prisma/src';
import { LoggerModule } from 'libs/logger/src';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { CronModule } from './cron/cron.module';
import { validateEnv } from './common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    LoggerModule,
    AuthModule,
    AgentsModule,
    CronModule,
  ],
})
export class AppModule {}
