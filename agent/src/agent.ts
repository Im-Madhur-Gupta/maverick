// import { AIService } from "./services/ai";
import { WalletService } from "./services/wallet";
// import { DataService } from "./services/data";
import { AgentConfig, MarketSignal, Transaction, TraderProfile } from "./types";
// import { validateConfig } from "./config";
// import { PERSONA_CONFIGS } from "./config/personas";
import { AgentPersona } from "./types/agent";

export class TradingAgent {
  // private ai: AIService;
  // private data: DataService;
  // private config: AgentConfig;
  // private isRunning: boolean = false;

  wallet: WalletService;

  constructor(config: AgentConfig) {
    // this.config = config;
    // this.ai = new AIService(process.env.ANTHROPIC_API_KEY || "");
    this.wallet = new WalletService(
      config.walletConfig.fereApiKey,
      config.walletConfig.fereUserId
    );
    // this.data = new DataService();
  }

  async walletAddress(): Promise<string> {
    return this.wallet.walletAddress();
  }

  async initialize(personaId: AgentPersona): Promise<{
    agentId: string;
    evmAddress: string;
    solAddress: string;
  }> {
    // Initialize Fere agent with persona-specific prompts
    return this.wallet.initialize(personaId);
  }

  // private getPersonaWeightedScore(
  //   tokenData: any,
  //   socialMetrics: any,
  //   whaleMetrics: any,
  //   tokenAddress: string
  // ): number {
  //   const persona = PERSONA_CONFIGS[this.config.persona];
  //   const isPrimaryToken = tokenAddress === this.config.primaryToken;

  //   const technicalScore =
  //     this.calculateTechnicalScore(tokenData) * persona.technicalWeight;
  //   const socialScore =
  //     this.calculateSocialScore(socialMetrics) * persona.socialWeight;
  //   const whaleScore =
  //     this.calculateWhaleScore(whaleMetrics) * persona.whaleFollowingWeight;

  //   const totalWeight =
  //     persona.technicalWeight +
  //     persona.socialWeight +
  //     persona.whaleFollowingWeight;
  //   const baseScore = (technicalScore + socialScore + whaleScore) / totalWeight;

  //   // Boost score for primary token
  //   return isPrimaryToken ? baseScore * 1.2 : baseScore;
  // }

  // private calculateTechnicalScore(tokenData: any): number {
  //   // Implement technical analysis scoring (0-1)
  //   // Consider: price momentum, volume trends, volatility
  //   return 0.5; // Placeholder
  // }

  // private calculateSocialScore(socialMetrics: any): number {
  //   // Implement social metrics scoring (0-1)
  //   // Consider: Farcaster engagement, meme virality, community growth
  //   return 0.5; // Placeholder
  // }

  // private calculateWhaleScore(whaleMetrics: any): number {
  //   // Implement whale activity scoring (0-1)
  //   // Consider: large wallet movements, smart money flow
  //   return 0.5; // Placeholder
  // }

  // private async analyzeOpportunities(
  //   signals: MarketSignal[]
  // ): Promise<MarketSignal[]> {
  //   const opportunities: MarketSignal[] = [];
  //   const persona = PERSONA_CONFIGS[this.config.persona];

  //   for (const signal of signals) {
  //     const tokenData = await this.data.getTokenMetrics(signal.tokenAddress);

  //     // Simple validation checks
  //     if (!this.validateTokenMetrics(tokenData)) {
  //       continue;
  //     }

  //     // Adjust threshold based on persona risk tolerance (1-10 scale)
  //     const baseThreshold = 0.5 + (persona.riskTolerance - 5) * 0.05;
  //     const threshold =
  //       signal.tokenAddress === this.config.primaryToken
  //         ? baseThreshold * 0.9 // Lower threshold for primary token
  //         : baseThreshold;

  //     if (signal.confidence > threshold && signal.action !== "HOLD") {
  //       opportunities.push(signal);
  //     }
  //   }

  //   return opportunities;
  // }

  // private validateTokenMetrics(tokenData: any): boolean {
  //   // Basic validation - can be expanded based on requirements
  //   return tokenData && tokenData.liquidity > 0 && tokenData.volume24h > 0;
  // }

  // private async validateAndExecuteTrade(
  //   signal: MarketSignal
  // ): Promise<boolean> {
  //   try {
  //     // Standard validations
  //     if (await this.data.detectPumpAndDump(signal.tokenAddress)) {
  //       console.log(`Pump and dump detected for ${signal.tokenAddress}`);
  //       return false;
  //     }

  //     const historicalData = await this.data.getHistoricalData(
  //       signal.tokenAddress
  //     );
  //     const isValid = await this.ai.validateTrade(signal, historicalData);
  //     if (!isValid) {
  //       console.log(`AI validation failed for ${signal.tokenAddress}`);
  //       return false;
  //     }

  //     // Check stop loss and take profit if configured
  //     if (signal.action === "SELL") {
  //       const currentPrice = await this.data.getCurrentPrice(
  //         signal.tokenAddress
  //       );
  //       const entryPrice = await this.data.getEntryPrice(signal.tokenAddress);

  //       const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

  //       if (this.config.stopLoss && pnlPercent <= -this.config.stopLoss) {
  //         console.log(`Stop loss triggered for ${signal.tokenAddress}`);
  //         // Force the trade execution
  //         return await this.executeTrade(signal);
  //       }

  //       if (this.config.takeProfit && pnlPercent >= this.config.takeProfit) {
  //         console.log(`Take profit triggered for ${signal.tokenAddress}`);
  //         return await this.executeTrade(signal);
  //       }
  //     }

  //     // Execute trade with position sizing
  //     return await this.executeTrade(signal);
  //   } catch (error) {
  //     console.error("Error in trade validation/execution:", error);
  //     return false;
  //   }
  // }

  // private async executeTrade(signal: MarketSignal): Promise<boolean> {
  //   const balance = await this.wallet.getBalance();

  //   let tradeAmount = (balance.total * 0.1).toString(); // Default 10% of portfolio

  //   if (signal.action === "BUY" && this.config.maxPosition) {
  //     const currentPosition = await this.wallet.getTokenBalance(
  //       signal.tokenAddress
  //     );
  //     const remainingAllowed =
  //       parseFloat(this.config.maxPosition) - currentPosition;
  //     tradeAmount = Math.min(
  //       parseFloat(tradeAmount),
  //       remainingAllowed
  //     ).toString();
  //   }

  //   if (
  //     !(await this.wallet.validateLiquidity(signal.tokenAddress, tradeAmount))
  //   ) {
  //     console.log(`Insufficient liquidity for ${signal.tokenAddress}`);
  //     return false;
  //   }

  //   const transaction: Transaction = {
  //     hash: "",
  //     tokenAddress: signal.tokenAddress,
  //     amount: tradeAmount,
  //     type: signal.action,
  //     timestamp: Date.now(),
  //   };

  //   const txHash = await this.wallet.executeTransaction(transaction);
  //   console.log(`Transaction executed: ${txHash}`);
  //   return true;
  // }
}
