import { GetHoldingsResponse } from '../types/get-holdings.interface';

export const getHoldingsResponseExample: GetHoldingsResponse = {
  holdings: [
    {
      boughtAt: new Date(),
      tokensBought: 100000000,
      buyingPriceUsd: 100,
      currPriceUsd: 150,
      profitAbsUsd: 50,
      profitPerUsd: 0.5,
      isActive: true,
      dryRun: false,
      coin: {
        tokenName: 'Bitcoin',
        poolName: 'Bitcoin Pool',
        baseAddress: '0x0000000000000000000000000000000000000000',
        poolAddress: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
  ],
};
