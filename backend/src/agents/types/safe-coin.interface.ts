import { Coin } from '@prisma/client';

/**
 * A safe representation of a Coin entity for external use.
 * Excludes internal database fields and only exposes necessary business identifiers and properties.
 */
export type SafeCoin = Pick<
  Coin,
  'baseAddress' | 'tokenName' | 'decimals' | 'poolName' | 'poolAddress'
>;
