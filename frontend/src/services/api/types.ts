export interface SignatureMessageResponse {
  message: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface SafeAgent {
  id: string;
  name: string;
  description: string;
  persona: string;
  solanaAddress: string;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: string;
    solanaAddress: string;
  };
}

export interface Agent extends SafeAgent {
  solanaPvtKey: string;
}

export interface Holding {
  boughtAt: string;
  tokensBought: number;
  buyingPriceUsd: number;
  currPriceUsd: number;
  profitAbsUsd: number;
  profitPerUsd: number;
  isActive: boolean;
  dryRun: boolean;
  coin: {
    tokenName: string;
    poolName: string;
    baseAddress: string;
    poolAddress: string;
    decimals: number;
  };
}

export interface PortfolioResponse {
  id: string;
  agent_id: string;
  start_time: string;
  start_usd: number;
  curr_realised_usd: number;
  curr_unrealised_usd: number;
  dry_run: boolean;
}

export interface Portfolio {
  id: string;
  agentId: string;
  startTime: string;
  startUsd: number;
  currRealisedUsd: number;
  currUnrealisedUsd: number;
  dryRun: boolean;
}

export interface ProcessedCoinSignal {
  type: string;
  strength: number;
  amount: number;
  agentId: string;
  sentAt: string;
  coin: {
    tokenName: string;
    poolName: string;
    baseAddress: string;
    poolAddress: string;
    decimals: number;
  };
}
