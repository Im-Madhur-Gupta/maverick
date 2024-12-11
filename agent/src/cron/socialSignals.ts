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
    this.job = new CronJob("*/5 * * * * *", async () => {
      try {
        if (!fs.existsSync("disciple_id.txt")) {
          console.log("No disciple ID found. Returning...");
          return;
        }

        // Read agent ID from file
        const MONITORED_AGENT_ID = fs.readFileSync("disciple_id.txt", "utf8");

        console.log(`Monitored agent ID: ${MONITORED_AGENT_ID}`);

        console.log("Starting social signals analysis...");
        const holdings = await this.dataService.getAgentHoldings(
          MONITORED_AGENT_ID
        );

        const signals = await this.dataService.getFarcasterSignals(holdings);

        for (let i = 0; i < signals.length; i++) {
          const signal = signals[i];
          console.log(`Agent ${MONITORED_AGENT_ID} - ${signal.tokenAddress}:`);
          console.log(`  Confidence: ${signal.confidence.toFixed(2)}`);
          console.log(`  Recommended Action: ${signal.action}`);
          console.log(`  Signal Source: ${signal.source}`);
          console.log(
            `  Amount: ${signal.amount === null ? "HOLD" : signal.amount}`
          );
          console.log(
            `  Timestamp: ${new Date(signal.timestamp).toISOString()}`
          );

          const currentHolding = holdings[i];

          // Notify trading system for actionable signals
          if (signal.action === "SELL" && signal.amount !== null) {
            await this.dataService.notifyTradingSystem(
              MONITORED_AGENT_ID,
              currentHolding,
              signal
            );
          }
          // TODO: Implement BUY action when ready from Fere AI
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
