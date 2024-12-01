export interface AgentConfig {
  // Wallet configuration
  walletConfig: {
    apiKeyName: string;
    privateKey: string;
    network: string;
  };
  
  // AI configuration
  aiConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
  };

  // Trading configuration
  tradingConfig: {
    maxSlippage: number;
    minLiquidity: number;
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

export interface TraderProfile {
  address?: string;
  farcasterId?: string;
  recentTrades?: Transaction[];
  riskScore?: number;
}

export interface Transaction {
  hash: string;
  tokenAddress: string;
  amount: string;
  type: 'BUY' | 'SELL';
  timestamp: number;
}

export interface MarketSignal {
  tokenAddress: string;
  confidence: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  source: 'KOL' | 'ONCHAIN' | 'SOCIAL';
  timestamp: number;
}

export interface AgentMemory {
  recentTransactions: Transaction[];
  activePositions: Map<string, number>;
  tradingHistory: {
    profits: number;
    trades: number;
    winRate: number;
  };
  knownTokens: Set<string>;
} 