export interface CoinWithHoldings {
  id: number;
  tokenName: string;
  holdings: Array<{
    externalId: string;
    tokensBought: number;
    agent: {
      externalId: string;
    };
  }>;
}
