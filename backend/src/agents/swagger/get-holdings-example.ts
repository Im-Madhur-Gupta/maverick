import { GetHoldingsResponse } from '../types/get-holdings.interface';

export const getHoldingsResponseExample: GetHoldingsResponse = [
  {
    agentId: '8e23cf09-6cd9-4556-9970-850911569cbd',
    coinId: 'bad278ff-d10f-4a75-85fb-7a4b676cdf93',
    boughtAt: new Date(),
    tokensBought: 100000000,
    buyingPriceUsd: 100,
    currPriceUsd: 150,
    profitAbsUsd: 50,
    profitPerUsd: 0.5,
    isActive: true,
    dryRun: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
