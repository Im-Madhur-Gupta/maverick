export type AgentPersona = 'MOON_CHASER' | 'MEME_LORD' | 'WHALE_WATCHER';

export interface PersonaConfig {
    name: string;
    description: string;
    riskTolerance: number;
    socialWeight: number;
    technicalWeight: number;
    whaleFollowingWeight: number;
    customPromptModifiers: string[];
}

export interface TokenConfig {
    address: string;
    symbol: string;
    name: string;
    minPosition?: string;
    maxPosition?: string;
    stopLoss?: number;
    takeProfit?: number;
}

export interface AgentConfig {
    persona: AgentPersona;
    trackedTokens: TokenConfig[];
    primaryToken?: string;
    walletConfig: {
        fereApiKey: string;
        fereUserId: string;
    };
}

export interface Trade {
    id: string;
    tokenAddress: string;
    tokenSymbol: string;
    type: 'BUY' | 'SELL';
    amount: string;
    price: string;
    timestamp: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    txHash?: string;
}

export interface Portfolio {
    totalValue: string;
    tokens: {
        address: string;
        symbol: string;
        balance: string;
        value: string;
        pnl: number;
    }[];
}

export interface AgentStats {
    totalTrades: number;
    successfulTrades: number;
    totalPnL: number;
    winRate: number;
    avgTradeSize: string;
} 