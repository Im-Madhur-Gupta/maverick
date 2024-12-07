import { TraderProfile, MarketSignal } from "../types";
import axios from "axios";

interface AgentHolding {
  id: string;
  agent_id: string;
  token_name: string;
  base_address: string;
  is_active: boolean;
  tokens_bought: number;
  buying_price_usd: number;
  curr_price_usd: number;
  profit_abs_usd: number;
}

interface FarcasterCast {
  body: {
    publishedAt: number;
    username: string;
    data: {
      text: string;
    };
  };
  meta: {
    reactions: { count: number };
    recasts: { count: number };
    numReplyChildren: number;
  };
}

// Top memecoin traders/KOLs to monitor
const KOL_HANDLES = [
  "degen",
  "memecoinchad",
  "shibamaster",
  // Add more KOL handles here
];

export class DataService {
  private readonly SEARCHCASTER_API = "https://searchcaster.xyz/api";
  private readonly SIGNAL_THRESHOLD = 0.6;
  private readonly TRADING_API_BASE = "https://api.fereai.xyz/ta/";
  private readonly FERE_USER_ID = process.env.FERE_USER_ID;

  async getAgentHoldings(agentId: string): Promise<AgentHolding[]> {
    try {
      const response = await axios.get(
        `${this.TRADING_API_BASE}/ta/agent/${agentId}/holdings/`,
        {
          headers: { Accept: "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching holdings for agent ${agentId}:`, error);
      return [];
    }
  }

  private calculateSocialScore(cast: FarcasterCast): number {
    const { reactions, recasts } = cast.meta;
    const replies = cast.meta.numReplyChildren;

    const engagementScore =
      (reactions.count * 1 + recasts.count * 2 + replies * 1.5) / 100;
    return Math.min(engagementScore, 1);
  }

  private determineTradingAction(cast: FarcasterCast): "BUY" | "SELL" | "HOLD" {
    const text = cast.body.data.text.toLowerCase();

    // Simple sentiment analysis based on keywords
    const bullishKeywords = [
      "buy",
      "moon",
      "pump",
      "bullish",
      "launch",
      "gem",
      "ape",
      "fomo",
    ];
    const bearishKeywords = [
      "sell",
      "dump",
      "rug",
      "scam",
      "bearish",
      "exit",
      "dead",
    ];

    const bullishCount = bullishKeywords.filter((word) =>
      text.includes(word)
    ).length;
    const bearishCount = bearishKeywords.filter((word) =>
      text.includes(word)
    ).length;

    if (bullishCount > bearishCount) return "BUY";
    if (bearishCount > bullishCount) return "SELL";
    return "HOLD";
  }

  private async fetchCastsByKeyword(keyword: string): Promise<FarcasterCast[]> {
    try {
      const response = await axios.get(
        `${this.SEARCHCASTER_API}/search?text=${encodeURIComponent(keyword)}`
      );
      return response.data.casts;
    } catch (error) {
      console.error(`Error fetching casts for keyword ${keyword}:`, error);
      return [];
    }
  }

  private async fetchCastsByKOL(): Promise<FarcasterCast[]> {
    const allCasts: FarcasterCast[] = [];

    for (const handle of KOL_HANDLES) {
      try {
        const response = await axios.get(
          `${this.SEARCHCASTER_API}/search?username=${handle}`
        );
        allCasts.push(...response.data.casts);
      } catch (error) {
        console.error(`Error fetching casts for KOL ${handle}:`, error);
      }
    }

    return allCasts;
  }

  async notifyTradingSystem(
    agentId: string,
    holding: AgentHolding,
    signal: MarketSignal
  ): Promise<void> {
    if (!this.FERE_USER_ID) {
      throw new Error("FERE_USER_ID not set in environment variables");
    }

    try {
      if (signal.action === "SELL" && signal.amount) {
        // For SELL, we use the API to create a sell instruction
        await axios.post(
          `${this.TRADING_API_BASE}/ta/agent/${agentId}/sell/${holding.id}/${signal.amount}/`,
          {},
          {
            headers: {
              "x-fere-userid": this.FERE_USER_ID,
            },
          }
        );
        console.log(
          `Sell order created for ${signal.amount} tokens of ${holding.token_name}`
        );
      } else if (signal.action === "BUY" && signal.amount) {
        // TODO: Implement BUY logic when API is available
        console.log("BUY action not implemented yet");
      }
      // No action needed for HOLD
    } catch (error) {
      console.error("Error notifying trading system:", error);
      throw error;
    }
  }

  async getFarcasterSignals(
    tokenName: string,
    currentHolding: AgentHolding
  ): Promise<MarketSignal> {
    let totalConfidence = 0;
    let weightedBuyCount = 0;
    let weightedSellCount = 0;
    let weightedHoldCount = 0;
    let totalWeight = 0;
    let latestTimestamp = 0;

    // 1. Get signals from keyword search
    const keywordCasts = await this.fetchCastsByKeyword(tokenName);
    for (const cast of keywordCasts) {
      const confidence = this.calculateSocialScore(cast);
      if (confidence > this.SIGNAL_THRESHOLD) {
        const weight = 1.0;
        const action = this.determineTradingAction(cast);

        totalConfidence += confidence * weight;
        totalWeight += weight;

        switch (action) {
          case "BUY":
            weightedBuyCount += weight;
            break;
          case "SELL":
            weightedSellCount += weight;
            break;
          case "HOLD":
            weightedHoldCount += weight;
            break;
        }

        latestTimestamp = Math.max(latestTimestamp, cast.body.publishedAt);
      }
    }

    // 2. Get signals from KOL monitoring
    const kolCasts = await this.fetchCastsByKOL();
    const relevantKolCasts = kolCasts.filter((cast) =>
      cast.body.data.text.toLowerCase().includes(tokenName.toLowerCase())
    );

    for (const cast of relevantKolCasts) {
      const confidence = this.calculateSocialScore(cast);
      if (confidence > this.SIGNAL_THRESHOLD) {
        const weight = 1.5;
        const action = this.determineTradingAction(cast);

        totalConfidence += confidence * weight;
        totalWeight += weight;

        switch (action) {
          case "BUY":
            weightedBuyCount += weight;
            break;
          case "SELL":
            weightedSellCount += weight;
            break;
          case "HOLD":
            weightedHoldCount += weight;
            break;
        }

        latestTimestamp = Math.max(latestTimestamp, cast.body.publishedAt);
      }
    }

    // If no signals found, return HOLD with low confidence
    if (totalWeight === 0) {
      return {
        tokenAddress: tokenName,
        confidence: 0.1,
        action: "HOLD",
        source: "SOCIAL",
        timestamp: Date.now(),
        amount: null,
      };
    }

    // Calculate final confidence and action
    const finalConfidence = totalConfidence / totalWeight;

    // Determine final action based on weighted counts
    let finalAction: "BUY" | "SELL" | "HOLD";
    const maxCount = Math.max(
      weightedBuyCount,
      weightedSellCount,
      weightedHoldCount
    );

    if (maxCount === weightedBuyCount) finalAction = "BUY";
    else if (maxCount === weightedSellCount) finalAction = "SELL";
    else finalAction = "HOLD";

    // Determine amount based on action and confidence
    let amount: number | null = null;
    if (finalAction === 'SELL') {
      // Calculate sell amount based on confidence levels
      // confidence ranges: 0.6-0.7 (low), 0.7-0.85 (medium), 0.85+ (high)
      if (finalConfidence >= 0.85) {
        // High confidence: Sell 90-100% of holdings
        amount = Math.floor(currentHolding.tokens_bought * 0.9);
      } else if (finalConfidence >= 0.7) {
        // Medium confidence: Sell 50-75% of holdings
        const sellPercentage = 0.5 + ((finalConfidence - 0.7) / 0.15) * 0.25;
        amount = Math.floor(currentHolding.tokens_bought * sellPercentage);
      } else {
        // Low confidence: Sell 25-50% of holdings
        const sellPercentage = 0.25 + ((finalConfidence - 0.6) / 0.1) * 0.25;
        amount = Math.floor(currentHolding.tokens_bought * sellPercentage);
      }
    } else if (finalAction === 'BUY') {
      // Calculate buy amount based on confidence and current holdings
      // For new tokens (tokens_bought = 0), we'll use confidence directly
      // For existing holdings, we'll increase position based on confidence
      
      if (currentHolding.tokens_bought === 0) {
        // New position: Buy amount based on confidence
        // Start with a modest position for low confidence
        const baseAmount = 1000; // Base amount in tokens
        amount = Math.floor(baseAmount * (1 + finalConfidence));
      } else {
        // Existing position: Increase based on confidence
        if (finalConfidence >= 0.85) {
          // High confidence: Increase position by 50-100%
          const buyPercentage = 0.5 + ((finalConfidence - 0.85) / 0.15) * 0.5;
          amount = Math.floor(currentHolding.tokens_bought * buyPercentage);
        } else if (finalConfidence >= 0.7) {
          // Medium confidence: Increase position by 25-50%
          const buyPercentage = 0.25 + ((finalConfidence - 0.7) / 0.15) * 0.25;
          amount = Math.floor(currentHolding.tokens_bought * buyPercentage);
        } else {
          // Low confidence: Increase position by 10-25%
          const buyPercentage = 0.1 + ((finalConfidence - 0.6) / 0.1) * 0.15;
          amount = Math.floor(currentHolding.tokens_bought * buyPercentage);
        }
      }
    }

    return {
      tokenAddress: tokenName,
      confidence: finalConfidence,
      action: finalAction,
      source: weightedBuyCount > weightedSellCount ? "SOCIAL" : "KOL",
      timestamp: latestTimestamp || Date.now(),
      amount,
    };
  }

  async getTopTraderActivities(addresses: string[]): Promise<TraderProfile[]> {
    // TODO: Implement on-chain data fetching for top traders
    // This will track specified addresses and their trading patterns
    return [];
  }

  async getTokenMetrics(tokenAddress: string) {
    // TODO: Implement token metrics fetching
    // This will get liquidity, volume, holder distribution etc.
    return {
      liquidity: 0,
      volume24h: 0,
      holders: 0,
      topHolderConcentration: 0,
    };
  }

  async detectPumpAndDump(tokenAddress: string): Promise<boolean> {
    // TODO: Implement pump and dump detection
    // This will analyze price/volume patterns and holder behavior
    const metrics = await this.getTokenMetrics(tokenAddress);

    // Placeholder logic - to be implemented
    const redFlags = [
      metrics.topHolderConcentration > 0.5, // Over 50% held by top wallets
      metrics.volume24h < metrics.liquidity * 0.1, // Low volume relative to liquidity
      // Add more sophisticated checks
    ];

    return redFlags.some((flag) => flag);
  }

  async getHistoricalData(tokenAddress: string) {
    // TODO: Implement historical data fetching
    // This will get price and volume history
    return {
      prices: [],
      volumes: [],
      timestamps: [],
    };
  }
}
