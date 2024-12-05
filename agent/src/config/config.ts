import { AgentConfig } from "../types";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export function getConfig(): AgentConfig {
  return {
    walletConfig: {
      fereApiKey: process.env.FERE_API_KEY || "",
      fereUserId: process.env.FERE_USER_ID || "",
      network: process.env.NETWORK || "base-sepolia",
    },
    aiConfig: {
      model: "claude-3-sonnet-20240229", // Using Anthropic's Claude
      temperature: 0.7,
      maxTokens: 2000,
    },
    tradingConfig: {
      maxSlippage: 0.01,
      minLiquidity: 1000,
      maxPositionSize: 0.1,
      stopLoss: 0.1,
      takeProfit: 0.3,
    },
  };
}

export function validateConfig(config: AgentConfig): void {
  // Validate wallet config
  if (!config.walletConfig.fereApiKey || !config.walletConfig.fereUserId) {
    throw new Error("Missing FereAI credentials");
  }

  // Validate AI config
  if (!config.aiConfig.model) {
    throw new Error("Missing AI model configuration");
  }

  // Validate trading config
  if (
    config.tradingConfig.maxSlippage <= 0 ||
    config.tradingConfig.minLiquidity <= 0 ||
    config.tradingConfig.maxPositionSize <= 0 ||
    config.tradingConfig.stopLoss <= 0 ||
    config.tradingConfig.takeProfit <= 0
  ) {
    throw new Error("Invalid trading configuration values");
  }
}
