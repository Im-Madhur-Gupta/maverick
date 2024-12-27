export interface TradingConfig {
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  maxSlippage: number;
}

export interface RiskConfig {
  maxDailyTrades: number;
  maxConcurrentPositions: number;
  minLiquidity: number;
  maxDrawdown: number;
}

export interface DataSourcesConfig {
  dex: string[];
  social: string[];
  priceFeeds: string[];
}

export interface LLMConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

export interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  name: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
}

export interface NetworksConfig {
  [key: string]: NetworkConfig;
}

export interface AgentConfig {
  trading: TradingConfig;
  risk: RiskConfig;
  dataSources: DataSourcesConfig;
  llm: LLMConfig;
  networks: NetworksConfig;
  logLevel?: string;
} 