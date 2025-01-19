import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import * as pLimit from 'p-limit';
import { LoggerService } from 'libs/logger/src/logger.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { FereService } from 'src/fere/fere.service';
import { CoinSignalService } from 'src/coin-signal/coin-signal.service';
import { FERE_API_CONCURRENT_LIMIT } from 'src/fere/constants';
import { FereAgentHolding } from 'src/fere/types/fere-agent-holdings.interface';
import { CoinWithHoldings } from './types/coin-with-holdings.interface';

@Injectable()
export class CronService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly fereService: FereService,
    private readonly coinSignalService: CoinSignalService,
  ) {}

  /**
   * Main cron job that runs every minute.
   *
   * Steps involved:
   * 1. Syncs holdings data from FereAI to keep our local state updated
   * 2. For each coin with active holdings:
   *    - Fetches relevant social posts
   *    - Generates AI-based trading signals
   *    - Processes signals into trade instructions
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async syncHoldingsAndProcessSignals() {
    this.loggerService.info('Starting holdings sync and signal processing');

    try {
      await this.syncAllAgentHoldings();
      await this.enqueueCoinSignals();

      this.loggerService.info('Completed holdings sync and signal processing');
    } catch (error) {
      this.loggerService.error(
        'Failed to complete holdings sync and signal processing:',
        error,
      );
      throw error;
    }
  }

  /**
   * Synchronizes holdings data for all active agents from FereAI.
   *
   * Process:
   * 1. Fetches active agents from our database
   * 2. Makes parallel API calls to FereAI to get current holdings
   * 3. Updates our database with new holding positions
   */
  private async syncAllAgentHoldings() {
    this.loggerService.info('Starting sync of agent holdings from FereAI');

    // Fetch externals Ids of active agents
    const agents = await this.prismaService.agent.findMany({
      where: { isActive: true },
      select: { id: true, externalId: true },
    });

    if (agents.length === 0) {
      this.loggerService.info('No active agents found to sync holdings');
      return;
    }

    // Parallel API calls to FereAI to fetch holdings
    const limit = pLimit(FERE_API_CONCURRENT_LIMIT);
    const holdingsData = await Promise.all(
      agents.map((agent) =>
        limit(async () => {
          try {
            const fereHoldings = await this.fereService.getHoldings(
              agent.externalId,
            );
            return {
              agentId: agent.id,
              fereHoldings,
            };
          } catch (error) {
            this.loggerService.error(
              `Failed to fetch holdings for agent ${agent.id}:`,
              error,
            );
            return null; // Return null to indicate failure
          }
        }),
      ),
    );

    // Sequential DB operations to upsert holdings
    const successfulSyncs = [];
    const failedSyncs = [];

    for (const data of holdingsData) {
      if (!data) {
        continue; // Skip if fetching holdings failed
      }

      const { agentId, fereHoldings } = data;
      try {
        await this.syncAgentHoldings(agentId, fereHoldings);
        successfulSyncs.push(agentId);
      } catch (error) {
        failedSyncs.push(agentId);
        this.loggerService.error(
          `Failed to sync data for agent ${agentId}:`,
          error,
        );
      }
    }

    this.loggerService.info('Completed sync of agent holdings from FereAI', {
      successfulSyncs,
      failedSyncs,
      totalAgents: agents.length,
    });
  }

  /**
   * Updates database with an agent's current holdings from FereAI.
   *
   * Process:
   * For each holding:
   *  - Creates coin if needed
   *  - Updates holding position details
   *
   * @param agentId - Internal database ID of the agent
   * @param fereHoldings - Current holdings data from FereAI
   */
  private async syncAgentHoldings(
    agentId: string,
    fereHoldings: FereAgentHolding[],
  ) {
    this.loggerService.info(`Syncing data for agent ${agentId}`);

    try {
      await this.prismaService.$transaction(async (tx) => {
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

          this.loggerService.debug(
            `Upserting coin with baseAddress: ${baseAddress}, coinName: ${tokenName}`,
          );

          const { id: coinId } = await tx.coin.upsert({
            where: { baseAddress },
            update: {},
            create: {
              tokenName,
              poolName,
              baseAddress,
              poolAddress,
              decimals,
            },
          });

          this.loggerService.debug(
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

      this.loggerService.info(`Syncing data completed for agent ${agentId}`, {
        holdingsCount: fereHoldings.length,
      });
    } catch (error) {
      this.loggerService.error(
        `DB Transaction failed for agent ${agentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Enqueues coin signal jobs for all coins with active holdings.
   *
   * For each coin, creates a pipeline-based job that will:
   * 1. Fetch relevant social posts
   * 2. Generate AI-based trading signals
   * 3. Process signals into trade instructions (buy/sell)
   *
   * Each coin's pipeline runs independently through the BullMQ queue system
   * to ensure scalability and fault isolation.
   */
  private async enqueueCoinSignals() {
    this.loggerService.info('Starting to enqueue coin signal jobs');

    try {
      const coins = await this.findCoinsWithHoldings();

      if (coins.length === 0) {
        this.loggerService.warn('No coins with active holdings found');
        return;
      }

      const successfulEnqueues = [];
      const failedEnqueues = [];

      // Enqueue signal pipeline job for each coin
      for (const coin of coins) {
        try {
          const holdings = coin.holdings.map((holding) => ({
            agentExternalId: holding.agent.externalId,
            holdingExternalId: holding.externalId,
            amountBought: holding.tokensBought,
          }));

          await this.coinSignalService.enqueue(
            coin.id,
            coin.tokenName,
            holdings,
          );
          successfulEnqueues.push(coin.tokenName);
        } catch (error) {
          failedEnqueues.push(coin.tokenName);
          this.loggerService.error(
            `Failed to enqueue coin signal job for ${coin.tokenName}:`,
            error,
          );
        }
      }

      this.loggerService.info('Completed enqueuing coin signal jobs', {
        successfulEnqueues,
        failedEnqueues,
        totalCoins: coins.length,
      });
    } catch (error) {
      this.loggerService.error('Failed to enqueue coin signal jobs:', error);
      throw error;
    }
  }

  /**
   * Retrieves all coins that have active holdings from active agents.
   *
   * @returns Promise<CoinWithHoldings[]> Array of coins with their associated holdings data:
   *  - id: Coin's unique identifier
   *  - tokenName: Name of the token/coin
   *  - holdings: Array of active holdings containing:
   *    - externalId: FereAI's holding identifier
   *    - tokensBought: Amount of tokens in the holding
   *    - agent: Associated agent data with their externalId
   */
  private async findCoinsWithHoldings(): Promise<CoinWithHoldings[]> {
    const activeHoldingConditions = {
      isActive: true,
      agent: {
        isActive: true,
      },
    };

    return this.prismaService.coin.findMany({
      where: {
        holdings: {
          some: activeHoldingConditions,
        },
      },
      select: {
        id: true,
        tokenName: true,
        holdings: {
          where: activeHoldingConditions,
          select: {
            externalId: true,
            tokensBought: true,
            agent: {
              select: {
                externalId: true,
              },
            },
          },
        },
      },
    });
  }
}
