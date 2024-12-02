import dotenv from 'dotenv';
import { TradingAgent } from './agent';
import { DEFAULT_CONFIG } from './config/config';
import winston from 'winston';

// Setup logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

async function main() {
  try {
    // Load environment variables
    dotenv.config();

    // Initialize agent
    logger.info("Initializing MemeCoin Maverick agent...");
    const agent = new TradingAgent(DEFAULT_CONFIG);

    // Create wallet
    const walletInfo = await agent.initialize();
    logger.info("Wallet created:", { walletId: walletInfo });

    logger.info("Starting agent...", { address: await agent.walletAddress() });

    // // Run initial observation
    // logger.info("Getting initial market state...");
    // await agent.tradingCycle();

    // // Main agent loop
    // while (true) {
    //   try {
    //     logger.info("Starting new trading cycle...");
    //     await agent.tradingCycle();

    //     // Wait before next cycle (5 minutes)
    //     await new Promise(resolve => setTimeout(resolve, 300000));

    //   } catch (err) {
    //     logger.error("Error in trading cycle:", { error: err });
    //     // Wait before retry (1 minute)
    //     await new Promise(resolve => setTimeout(resolve, 60000));
    //     continue;
    //   }
    // }
  } catch (err) {
    logger.error("Critical error:", { error: err });
    throw err;
  }
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
  logger.info("Shutting down MemeCoin Maverick...");
  process.exit(0);
});

// Start the agent
main().catch(e => {
  logger.error("Fatal error:", { error: e.message });
  process.exit(1);
}); 