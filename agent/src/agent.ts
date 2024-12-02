import { AIService } from "./services/ai";
import { WalletService } from "./services/wallet";
import { DataService } from "./services/data";
import { AgentConfig, MarketSignal, Transaction, TraderProfile } from "./types";
import { validateConfig } from "./config";

export class TradingAgent {
  private ai: AIService;
  private wallet: WalletService;
  private data: DataService;
  private config: AgentConfig;
  private isRunning: boolean = false;

  constructor(config: AgentConfig) {
    validateConfig(config);
    this.config = config;
    this.ai = new AIService(process.env.ANTHROPIC_API_KEY || "");
    this.wallet = new WalletService(
      config.walletConfig.apiKeyName,
      config.walletConfig.privateKey
    );
    this.data = new DataService();
  }

  async walletAddress(): Promise<string> {
    return this.wallet.walletAddress();
  }

  async initialize(): Promise<string> {
    return this.wallet.initialize();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.tradingCycle();
        // Wait for 5 minutes before next cycle
        await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
      } catch (error) {
        console.error("Error in trading cycle:", error);
        // Wait for 1 minute before retrying on error
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      }
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  async tradingCycle(): Promise<void> {
    // 1. Gather market data
    const topTraders = await this.data.getTopTraderActivities([]);
    const socialSignals = await this.data.getFarcasterSignals("");
    // Here along with onchain data of top traders we should also get onchain data of top performing coins from coingecko maybe on base sepolia, analyse their performance and then make trading decisions so there should be a function to get onchain data of coins from coingecko

    // 2. Analyze opportunities
    const opportunities = await this.analyzeOpportunities(
      topTraders,
      socialSignals
    );

    // 3. Execute valid trades
    for (const signal of opportunities) {
      if (await this.validateAndExecuteTrade(signal)) {
        console.log(`Successfully executed trade for ${signal.tokenAddress}`);
      }
    }
  }

  private async analyzeOpportunities(
    traders: TraderProfile[],
    signals: MarketSignal[]
  ): Promise<MarketSignal[]> {
    const opportunities: MarketSignal[] = [];

    for (const signal of signals) {
      // Get token metrics and historical data
      const tokenData = await this.data.getTokenMetrics(signal.tokenAddress);
      const historicalData = await this.data.getHistoricalData(
        signal.tokenAddress
      );

      // AI analysis
      const decision = await this.ai.analyzeTradingOpportunity(
        tokenData,
        signals,
        traders
      );

      if (decision.action !== "HOLD") {
        opportunities.push({
          tokenAddress: signal.tokenAddress,
          action: decision.action as "BUY" | "SELL",
          confidence: decision.confidence,
          source: "ONCHAIN",
          timestamp: Date.now(),
        });
      }
    }

    return opportunities;
  }

  private async validateAndExecuteTrade(
    signal: MarketSignal
  ): Promise<boolean> {
    try {
      // 1. Check for pump and dump
      if (await this.data.detectPumpAndDump(signal.tokenAddress)) {
        console.log(`Pump and dump detected for ${signal.tokenAddress}`);
        return false;
      }

      // 2. Validate with AI
      const historicalData = await this.data.getHistoricalData(
        signal.tokenAddress
      );
      const isValid = await this.ai.validateTrade(signal, historicalData);
      if (!isValid) {
        console.log(`AI validation failed for ${signal.tokenAddress}`);
        return false;
      }

      // 3. Check liquidity
      const balance = await this.wallet.getBalance();
      const tradeAmount = (
        balance.total * this.config.tradingConfig.maxPositionSize
      ).toString();
      if (
        !(await this.wallet.validateLiquidity(signal.tokenAddress, tradeAmount))
      ) {
        console.log(`Insufficient liquidity for ${signal.tokenAddress}`);
        return false;
      }

      // 4. Execute trade
      const transaction: Transaction = {
        hash: "",
        tokenAddress: signal.tokenAddress,
        amount: tradeAmount,
        type: signal.action === "HOLD" ? "SELL" : signal.action,
        timestamp: Date.now(),
      };

      const txHash = await this.wallet.executeTransaction(transaction);
      console.log(`Transaction executed: ${txHash}`);
      return true;
    } catch (error) {
      console.error("Error in trade validation/execution:", error);
      return false;
    }
  }
}
