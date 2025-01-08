import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';
import * as pLimit from 'p-limit';
import { LoggerService } from 'libs/logger/src/logger.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { FERE_MAX_CONCURRENT_API_CALLS } from 'src/fere/constants';
import { FereService } from 'src/fere/fere.service';
import { FereAgentHolding } from 'src/fere/types/fere-agent-holdings.interface';

@Injectable()
export class CronService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fereService: FereService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Synchronizes holdings data for all active agents in the DB.
   * This method runs automatically every 5 minutes.
   *
   * The synchronization process:
   * 1. Fetches all active agents from the database
   * 2. Makes parallel API calls to FereAI to fetch holdings data (with rate limiting)
   * 3. Upserts each agent's holdings sequentially in DB
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncAllAgentData() {
    this.logger.info('Starting sync of all agent data');

    // Fetch externals Ids of active agents
    const agents = await this.prisma.agent.findMany({
      where: { isActive: true },
      select: { id: true, externalId: true },
    });

    // Parallel API calls to FereAI to fetch holdings
    const limit = pLimit(FERE_MAX_CONCURRENT_API_CALLS);
    const holdingsData = await Promise.all(
      agents.map((agent) =>
        limit(async () => {
          try {
            const fereHoldings = await this.fereService.getHoldings(
              agent.externalId,
            );
            return { agentId: agent.id, fereHoldings };
          } catch (error) {
            this.logger.error(
              `Failed to fetch holdings for agent ${agent.id}`,
              { error },
            );
            return null; // Return null to indicate failure
          }
        }),
      ),
    );

    // Sequential DB operations to upsert holdings
    for (const data of holdingsData) {
      if (!data) continue; // Skip if fetching holdings failed

      const { agentId, fereHoldings } = data;
      try {
        await this.syncAgentData(agentId, fereHoldings);
      } catch (error) {
        this.logger.error(`Failed to sync data for agent ${agentId}`, {
          error,
        });
      }
    }

    this.logger.info('Completed sync of all agent data');
  }

  /**
   * Syncs data (coins and holdings) for a single agent in the database.
   * This method handles the database operations within a transaction:
   * 1. Creates new coins if they don't exist (no updates to existing coins)
   * 2. Upserts holdings data for the agent
   *
   * @param agentId - The internal database ID of the agent
   * @param fereHoldings - Array of holdings data from FereAI
   */
  private async syncAgentData(
    agentId: string,
    fereHoldings: FereAgentHolding[],
  ) {
    this.logger.info(`Syncing data for agent ${agentId}`);

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const holding of fereHoldings) {
          const {
            id: holdingExternalId,
            token_name: tokenName,
            pool_name: poolName,
            base_address: baseAddress,
            pool_address: poolAddress,
            decimals: decimals,
            bought_at: boughtAt,
            tokens_bought: tokensBought,
            buying_price_usd: buyingPriceUsd,
            curr_price_usd: currPriceUsd,
            profit_abs_usd: profitAbsUsd,
            profit_per_usd: profitPerUsd,
            is_active: isActive,
            dry_run: dryRun,
          } = holding;

          this.logger.debug(
            `Upserting coin with baseAddress: ${baseAddress}, coinName: ${tokenName}`,
          );

          const { id: coinId } = await tx.coin.upsert({
            where: {
              baseAddress,
            },
            update: {},
            create: {
              tokenName,
              poolName,
              baseAddress,
              poolAddress,
              decimals,
            },
          });

          this.logger.debug(
            `Upserting holding with agentId: ${agentId} and coinId: ${coinId}, coinName: ${tokenName}`,
          );

          await tx.holding.upsert({
            where: {
              agentId_coinId: {
                agentId,
                coinId,
              },
            },
            update: {
              boughtAt,
              tokensBought,
              buyingPriceUsd,
              currPriceUsd,
              profitAbsUsd,
              profitPerUsd,
              isActive,
              dryRun,
            },
            create: {
              agentId,
              coinId,
              externalId: holdingExternalId,
              boughtAt,
              tokensBought,
              buyingPriceUsd,
              currPriceUsd,
              profitAbsUsd,
              profitPerUsd,
              isActive,
              dryRun,
            },
          });
        }
      });

      this.logger.info(`Syncing data for agent ${agentId} completed`);
    } catch (error) {
      this.logger.error(`DB Transaction failed for agent ${agentId}`, {
        error,
      });
      throw error;
    }
  }
}
