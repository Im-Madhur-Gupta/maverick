export type AgentPersona = 'MOON_CHASER' | 'MEME_LORD' | 'WHALE_WATCHER';

export interface PersonaConfig {
    name: string;
    description: string;
    riskTolerance: number; // 1-10
    socialWeight: number; // 1-10
    technicalWeight: number; // 1-10
    whaleFollowingWeight: number; // 1-10
    customPromptModifiers: string[];
}

export interface TokenConfig {
    address: string;
    symbol: string;
    name: string;
    minPosition?: string; // Min amount to hold
    maxPosition?: string; // Max amount to hold
    stopLoss?: number; // Percentage
    takeProfit?: number; // Percentage
}

export interface AgentConfig {
    persona: AgentPersona;
    trackedTokens: TokenConfig[]; // List of tokens to track
    primaryToken?: string; // Address of the main token to focus on
    walletConfig: {
        fereApiKey: string;
        fereUserId: string;
    };
} 