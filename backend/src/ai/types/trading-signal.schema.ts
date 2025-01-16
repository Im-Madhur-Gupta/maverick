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
      .min(0)
      .max(100)
      .describe(
        'Percentage of current holdings to trade (0-100). For BUY: percentage to increase holdings by. For SELL: percentage of current holdings to sell. For HOLD: 0',
      ),
  })
  .strict();

export type TradingSignal = z.infer<typeof TradingSignalSchema>;
