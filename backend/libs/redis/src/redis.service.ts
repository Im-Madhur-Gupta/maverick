import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'libs/logger/src/logger.service';
import { createClient, RedisClientType } from 'redis';
import { ENV_CONFIG_KEYS } from 'src/common/config/env.config';
import { HoldingSignal } from './types/holding-signal.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.client = createClient({
      url: this.config.get(ENV_CONFIG_KEYS.REDIS_URL),
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            this.logger.error('Max redis reconnection attempts reached');
            return new Error('Max redis reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.info('Redis connection established');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      this.logger.info('Redis connection closed');
    } catch (error) {
      this.logger.error('Error closing Redis connection', error);
      throw error;
    }
  }

  // Coin Lock

  async lockCoin(coinId: number): Promise<boolean> {
    return this.client
      .set(`coin:lock:${coinId}`, Date.now().toString(), {
        NX: true,
        EX: 300,
      })
      .then((result) => result === 'OK');
  }

  async unlockCoin(coinId: number): Promise<void> {
    await this.client.del(`coin:lock:${coinId}`);
  }

  async isCoinLocked(coinId: number): Promise<boolean> {
    return (await this.client.get(`coin:lock:${coinId}`)) !== null;
  }

  // Holding Signal

  async saveHoldingSignal(signal: HoldingSignal): Promise<boolean> {
    return this.client
      .set(`holding:signal:${signal.holdingId}`, JSON.stringify(signal), {
        EX: 600,
      })
      .then((result) => result === 'OK');
  }

  async getHoldingSignal(holdingId: string): Promise<HoldingSignal | null> {
    const signal = await this.client.get(`holding:signal:${holdingId}`);
    return signal ? JSON.parse(signal) : null;
  }

  async deleteHoldingSignal(holdingId: string): Promise<void> {
    await this.client.del(`holding:signal:${holdingId}`);
  }
}
