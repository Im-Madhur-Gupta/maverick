import { ProcessedCoinSignal } from '@prisma/client';
import { SafeCoin } from 'src/agents/types/safe-coin.interface';

export type SafeProcessedCoinSignal = Pick<
  ProcessedCoinSignal,
  'type' | 'strength' | 'amount' | 'agentId' | 'sentAt'
> & {
  coin: SafeCoin;
};
