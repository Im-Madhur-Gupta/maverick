import { Transaction } from "../types";
import { FereAgent } from "./fere";
import {
  MEMECOIN_TRADER_PERSONA,
  MEMECOIN_POOL_DECISION_PROMPT,
  MEMECOIN_PORTFOLIO_DECISION_PROMPT,
} from "../prompts/fere";
import fs from "fs";
import path from "path";

interface WalletBalance {
  total: number;
  available: number;
  currency: string;
}

export class WalletService {
  private fereAgent: FereAgent;
  private discipleId: string | null = null;
  private keysDir: string;
  
  solAddress: string | null = null;
  evmAddress: string | null = null;

  constructor(apiKey: string, userId: string) {
    this.fereAgent = new FereAgent(apiKey, userId);
    this.keysDir = path.join(process.cwd(), "keys");
    if (!fs.existsSync(this.keysDir)) {
      fs.mkdirSync(this.keysDir, { recursive: true });
    }
  }

  private saveKeyToFile(filename: string, content: string): void {
    const filePath = path.join(this.keysDir, filename);
    fs.writeFileSync(filePath, content, { encoding: "utf8", mode: 0o600 });
  }

  async walletAddress(): Promise<string> {
    if (!this.discipleId) {
      console.error("Disciple not initialized");
      return "";
    }

    const portfolio = await this.fereAgent.getPortfolio(this.discipleId);
    return portfolio?.wallet_address || "";
  }

  async initialize(): Promise<string> {
    try {
      // Create a new disciple if none exists
      const disciples = await this.fereAgent.fetchDisciples();

      if (disciples.length > 0) {
        this.discipleId = disciples[0].id;
        return disciples[0].id;
      } else {
        // Create a new disciple with meme coin trading persona
        const agent = await this.fereAgent.createAgent({
          fereUserId: this.fereAgent.fereUserId,
          name: "Memecoin Maverick",
          description: "A specialized memecoin trader focused on Solana",
          persona: MEMECOIN_TRADER_PERSONA,
          dataSource: "trending",
          decisionPromptPool: MEMECOIN_POOL_DECISION_PROMPT,
          decisionPromptPortfolio: MEMECOIN_PORTFOLIO_DECISION_PROMPT,
          simulation: false,
          maxInvestmentPerSession: 0.2,
          stopLoss: 0.5,
          trailingStopLoss: 0.3,
          takeProfit: 1.0,
        });

        if (!agent) {
          throw new Error("Failed to create disciple");
        }

        this.solAddress = agent.sol_address;
        this.evmAddress = agent.evm_address;

        // Save keys to files
        this.saveKeyToFile("sol_private_key.txt", agent.sol_pvt_key);
        this.saveKeyToFile("evm_private_key.txt", agent.evm_pvt_key);
        this.saveKeyToFile("mnemonic.txt", agent.mnemonic);

        this.discipleId = agent.id;
        return agent.id;
      }
    } catch (error) {
      console.error("Failed to initialize disciple:", error);
      throw error;
    }
  }

  async executeTransaction(transaction: Transaction): Promise<string> {
    if (!this.discipleId) {
      throw new Error("Disciple not initialized");
    }

    try {
      if (transaction.type === "BUY") {
        // For buys, we let the agent decide based on its analysis
        const recommendations = await this.fereAgent.getTradeRecommendations(
          this.discipleId
        );
        const matchingRec = recommendations?.find(
          (rec) => rec.token_address === transaction.tokenAddress
        );

        if (!matchingRec || matchingRec.decision !== "BUY") {
          throw new Error("Agent does not recommend buying this token");
        }

        // The agent will handle the buy transaction
        return "HANDLED_BY_AGENT";
      } else {
        // For sells, we need to find the holding and sell it
        const holdings = await this.fereAgent.getHoldings(this.discipleId);
        const holding = holdings?.find(
          (h) => h.token_address === transaction.tokenAddress
        );

        if (!holding) {
          throw new Error("No matching holding found");
        }

        const task = await this.fereAgent.sellHolding(
          this.discipleId,
          holding.id,
          Number(transaction.amount)
        );

        if (!task) {
          throw new Error("Failed to initiate sell");
        }

        return task.task_id;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  async getBalance(): Promise<WalletBalance> {
    if (!this.discipleId) {
      throw new Error("Disciple not initialized");
    }

    try {
      const portfolio = await this.fereAgent.getPortfolio(this.discipleId);

      if (!portfolio) {
        throw new Error("Failed to fetch portfolio");
      }

      return {
        total: portfolio.curr_realised_usd + portfolio.curr_unrealised_usd,
        available: portfolio.curr_realised_usd,
        currency: "USD",
      };
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      throw error;
    }
  }

  async validateLiquidity(
    tokenAddress: string,
    amount: string
  ): Promise<boolean> {
    if (!this.discipleId) {
      throw new Error("Disciple not initialized");
    }

    try {
      // Get optimal gains which includes liquidity validation
      const gains = await this.fereAgent.getOptimalGains(this.discipleId);
      // TODO: Check this
      const tokenGains = gains?.find(
        (g: any) => g.token_address === tokenAddress
      );

      if (!tokenGains) {
        return false;
      }

      // Check if the amount we want to trade is within the optimal amount
      return Number(amount) <= tokenGains.optimal_amount;
    } catch (error) {
      console.error("Failed to validate liquidity:", error);
      return false;
    }
  }

  async getHoldings() {
    if (!this.discipleId) {
      throw new Error("Disciple not initialized");
    }
    return this.fereAgent.getHoldings(this.discipleId);
  }

  async getTrades(): Promise<any[] | void> {
    if (!this.discipleId) {
      throw new Error("Disciple not initialized");
    }
    return this.fereAgent.getTrades(this.discipleId);
  }
}
