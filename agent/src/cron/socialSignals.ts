// External imports
import { CronJob } from "cron";
import fs from "fs";

// Internal imports
import { DataService } from "../services/data";

export class SocialSignalsCron {
  private dataService: DataService;
  private job: CronJob;

  constructor() {
    this.dataService = new DataService();

    // Run every 5 minutes
    this.job = new CronJob("*/5 * * * *", async () => {
      try {
        // Read agent ID from file
        const MONITORED_AGENT_ID = fs.readFileSync("disciple_id.txt", "utf8");

        console.log("Starting social signals analysis...");
        const holdings = await this.dataService.getAgentHoldings(
          MONITORED_AGENT_ID
        );

        for (const holding of holdings) {
          if (holding.is_active) {
            const signal = await this.dataService.getFarcasterSignals(
              holding.token_name,
              holding
            );

            console.log(
              `Agent ${MONITORED_AGENT_ID} - ${signal.tokenAddress}:`
            );
            console.log(`  Confidence: ${signal.confidence.toFixed(2)}`);
            console.log(`  Recommended Action: ${signal.action}`);
            console.log(`  Signal Source: ${signal.source}`);
            console.log(
              `  Amount: ${signal.amount === null ? "HOLD" : signal.amount}`
            );
            console.log(
              `  Timestamp: ${new Date(signal.timestamp).toISOString()}`
            );

            // Notify trading system for actionable signals
            if (signal.action === "SELL" && signal.amount !== null) {
              await this.dataService.notifyTradingSystem(
                MONITORED_AGENT_ID,
                holding,
                signal
              );
            }
            // TODO: Implement BUY action
          }
        }
      } catch (error) {
        console.error("Error in social signals cron job:", error);
      }
    });
  }

  start() {
    this.job.start();
    console.log("Social signals cron job started");
  }

  stop() {
    this.job.stop();
    console.log("Social signals cron job stopped");
  }
}
