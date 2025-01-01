import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';
import pLimit from 'p-limit';
import { LoggerService } from 'libs/logger/src';
import { PrismaService } from 'libs/prisma/src';
import { FERE_MAX_CONCURRENT_API_CALLS } from 'src/fere/constants/fere.constants';
import { FereService } from 'src/fere/fere.service';
import { SyncAgentHoldingDto } from './dto/sync-agent-holding.dto';

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
   * 2. Processes each agent's holdings in parallel, with rate limiting to prevent API overload
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncAllAgentHoldings() {
    try {
      this.logger.info('Syncing agent holdings');

      // Fetch externals Ids of active agents
      const agents = await this.prisma.agent.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          externalId: true,
        },
      });

      const limit = pLimit(FERE_MAX_CONCURRENT_API_CALLS);

      // Sync holdings for each agent
      await Promise.all(
        agents.map(async (agent) =>
          limit(async () => this.syncAgentHoldings(agent)),
        ),
      );

      this.logger.info('Syncing agent holdings completed');
    } catch (error) {
      this.logger.error('Error syncing agent holdings', error);
    }
  }

  /**
   * Synchronizes holdings data for a single agent.
   * This method handles the complete synchronization for one agent:
   * 1. Fetches current holdings from the Fere service
   * 2. Updates both coin and holding records in a single transaction
   *
   * @param agent - The agent to sync holdings for
   * @param agent.id - The internal database ID of the agent
   * @param agent.externalId - The ID used to identify the agent in the Fere system
   *
   * @throws May throw errors from database operations or external API calls
   */
  private async syncAgentHoldings(agent: SyncAgentHoldingDto) {
    const { id: agentId, externalId: agentExternalId } = agent;

    this.logger.info(`Syncing holdings for agent ${agentId}`);

    // Fetch latest holdings for each agent
    const holdings = await this.fereService.getHoldings(agentExternalId);

    this.logger.info(
      `Fetched ${holdings.length} holdings for agent ${agentId}`,
    );

    // Update coins, holdings in DB in a batched DB transaction
    await this.prisma.$transaction(async (tx) => {
      for (const holding of holdings) {
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

    this.logger.info(`Syncing holdings for agent ${agentId} completed`);
  }
}
