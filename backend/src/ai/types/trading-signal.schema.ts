import { z } from 'zod';
import {
  TradingSignalStrength,
  TradingSignalType,
} from '../enums/trading-signal.enum';

export const TradingSignalSchema = z
  .object({
    type: z.nativeEnum(TradingSignalType),
    strength: z.nativeEnum(TradingSignalStrength),
    confidence: z.number().min(0).max(1),
    reasoning: z.string().min(100).max(1000).nonempty(),
  })
  .strict();

export type TradingSignal = z.infer<typeof TradingSignalSchema>;
