import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'libs/prisma/src/prisma.module';
import { LoggerModule } from 'libs/logger/src/logger.module';
import { AuthModule } from './auth/auth.module';
import { AgentsModule } from './agents/agents.module';
import { CronModule } from './cron/cron.module';
import { validateEnv } from './common/config/env.validation';
import { BullModule } from '@nestjs/bullmq';
import { ENV_CONFIG_KEYS } from './common/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get(ENV_CONFIG_KEYS.REDIS_URL),
        },
      }),
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
