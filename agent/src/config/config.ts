import { AgentConfig } from '../types';

export const DEFAULT_CONFIG: AgentConfig = {
  walletConfig: {
    apiKeyName: process.env.COINBASE_API_KEY_NAME || '',
    privateKey: process.env.COINBASE_PRIVATE_KEY || '',
    network: 'base', // Using Base for lower fees
  },
  
  aiConfig: {
    model: 'claude-3-sonnet-20240229',  // Using Anthropic's Claude
    temperature: 0.7,
    maxTokens: 2000,
  },

  tradingConfig: {
    maxSlippage: 0.02, // 2% max slippage
    minLiquidity: 100000, // $100k min liquidity
    maxPositionSize: 0.1, // 10% of portfolio
    stopLoss: 0.15, // 15% stop loss
    takeProfit: 0.3, // 30% take profit
  },
};

// Safety checks and validations
export function validateConfig(config: AgentConfig): void {
  if (!config.walletConfig.apiKeyName || !config.walletConfig.privateKey) {
    throw new Error('Missing Coinbase wallet credentials');
  }

  if (config.tradingConfig.maxSlippage > 0.05) {
    throw new Error('Slippage tolerance too high - risk of sandwich attacks');
  }

  if (config.tradingConfig.maxPositionSize > 0.2) {
    throw new Error('Position size too large - high risk exposure');
  }
} 