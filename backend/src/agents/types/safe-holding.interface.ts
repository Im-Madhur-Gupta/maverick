import { Holding } from '@prisma/client';
import { SafeCoin } from './safe-coin.interface';

/**
 * A safe representation of a Holding entity for external use.
 * Excludes internal database fields and composite key fields, focusing only on business-relevant data.
 */
export type SafeHolding = Pick<
  Holding,
  | 'boughtAt'
  | 'tokensBought'
  | 'buyingPriceUsd'
  | 'currPriceUsd'
  | 'profitAbsUsd'
  | 'profitPerUsd'
  | 'isActive'
  | 'dryRun'
> & {
  coin: SafeCoin;
};
