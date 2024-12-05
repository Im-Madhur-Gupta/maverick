import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';
import { MarketSignal } from '../types';
import { TRADING_PROMPT, TRADE_VALIDATION_PROMPT, PORTFOLIO_MANAGEMENT_PROMPT } from '../prompts/external-trading';

// Schema for trading decisions
const tradingDecision = z.object({
  action: z.enum(['BUY', 'SELL', 'HOLD']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  riskAssessment: z.object({
    pumpAndDumpRisk: z.number().min(0).max(1),
    liquidityRisk: z.number().min(0).max(1),
    volatilityRisk: z.number().min(0).max(1),
  }),
});

// Schema for trade validation
const tradeValidation = z.object({
  decision: z.enum(['YES', 'NO']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  riskFactors: z.array(z.string()),
});

// Schema for portfolio management
const portfolioManagement = z.object({
  adjustments: z.array(z.object({
    asset: z.string(),
    action: z.enum(['INCREASE', 'DECREASE', 'EXIT']),
    amount: z.string(),
    reason: z.string(),
  })),
  riskUpdates: z.object({
    stopLoss: z.string(),
    takeProfit: z.string(),
  }),
  newOpportunities: z.array(z.object({
    asset: z.string(),
    allocation: z.string(),
    reasoning: z.string(),
  })),
});

export class AIService {
  private model: ChatAnthropic;
  private tradingAnalysis;
  private tradeValidation;
  private portfolioManagement;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.model = new ChatAnthropic({
      anthropicApiKey: apiKey,
      modelName: "claude-3-sonnet-20240229",
      temperature: 0.7
    });

    this.tradingAnalysis = this.model.withStructuredOutput(tradingDecision);
    this.tradeValidation = this.model.withStructuredOutput(tradeValidation);
    this.portfolioManagement = this.model.withStructuredOutput(portfolioManagement);
  }

  async analyzeTradingOpportunity(
    tokenData: any,
    socialSignals: any[],
    traderProfiles: any[]
  ) {
    try {
      const prompt = TRADING_PROMPT
        .replace('{tokenData}', JSON.stringify(tokenData))
        .replace('{socialSignals}', JSON.stringify(socialSignals))
        .replace('{traderProfiles}', JSON.stringify(traderProfiles));

      const decision = await this.tradingAnalysis.invoke(prompt);
      return decision;
    } catch (error) {
      console.error('Error in AI trading analysis:', error);
      // Return HOLD with low confidence on error
      return {
        action: 'HOLD',
        confidence: 0.1,
        reasoning: 'Error in analysis',
        riskAssessment: {
          pumpAndDumpRisk: 1,
          liquidityRisk: 1,
          volatilityRisk: 1,
        },
      };
    }
  }

  async validateTrade(signal: MarketSignal, historicalData: any): Promise<boolean> {
    try {
      const prompt = TRADE_VALIDATION_PROMPT
        .replace('{signal}', JSON.stringify(signal))
        .replace('{historicalData}', JSON.stringify(historicalData));

      const validation = await this.tradeValidation.invoke(prompt);
      
      // Only approve trades with high confidence and YES decision
      return validation.decision === 'YES' && validation.confidence > 0.8;
    } catch (error) {
      console.error('Error in trade validation:', error);
      return false;
    }
  }

  async analyzePortfolio(portfolio: any, marketConditions: any) {
    try {
      const prompt = PORTFOLIO_MANAGEMENT_PROMPT
        .replace('{portfolio}', JSON.stringify(portfolio))
        .replace('{marketConditions}', JSON.stringify(marketConditions));

      const analysis = await this.portfolioManagement.invoke(prompt);
      return analysis;
    } catch (error) {
      console.error('Error in portfolio analysis:', error);
      throw error;
    }
  }
} 