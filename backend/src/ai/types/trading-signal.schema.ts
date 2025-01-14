import { z } from 'zod';
import {
  TradingSignalStrength,
  TradingSignalType,
} from '../enums/trading-signal.enum';

export const TradingSignalSchema = z
  .object({
    type: z
      .nativeEnum(TradingSignalType)
      .describe('Type of trading action to take (BUY/SELL/HOLD)'),
    strength: z
      .nativeEnum(TradingSignalStrength)
      .describe('Strength of the trading signal (WEAK/MODERATE/STRONG)'),
    percentage: z
      .number()
      .min(-100)
      .max(100)
      .describe(
        'Percentage of holdings to trade. Negative for sell, positive for buy, 0 for hold',
      ),
  })
  .strict();

export type TradingSignal = z.infer<typeof TradingSignalSchema>;
