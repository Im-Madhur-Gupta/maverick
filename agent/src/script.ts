import dotenv from "dotenv";
import { TradingAgent } from "./agent";
import { getConfig } from "./config/config";
import winston from "winston";
import axios from "axios";

// Setup logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

async function main() {
  try {
    // Load environment variables
    dotenv.config();

    // Initialize agent with config
    logger.info("Initializing MemeCoin Maverick agent for you...");

    // Initialize FereAI agent
    const {
      data: { agentId, evmAddress, solAddress },
    } = await axios.post("http://localhost:3000/api/create-agent", {
      personaId: 1,
    });
    logger.info("FereAI agent initialized:", {
      agentId,
      evmAddress,
      solAddress,
    });

    // Fetch trades every 10 seconds
    while (true) {
      const trades = await axios.get(
        `http://localhost:3000/api/agent/${agentId}/trades`
      );
      logger.info("Trades:", { trades });
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } catch (err) {
    logger.error("Critical error:", { error: err });
    throw err;
  }
}

// Handle shutdown gracefully
process.on("SIGINT", () => {
  logger.info("Shutting down MemeCoin Maverick...");
  process.exit(0);
});

// Start the agent
main().catch((e) => {
  logger.error("Fatal error:", { error: e.message });
  process.exit(1);
});
