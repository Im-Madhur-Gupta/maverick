import { Anthropic } from '@anthropic-ai/sdk';

export class AIService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  //     async analyzeTradingOpportunity(
  //         tokenData: any,
  //         signals: any[],
  //         traders: any[],
  //         promptModifiers: string[] = []
  //     ) {
  //         const basePrompt = `You are an expert memecoin trader analyzing a potential trading opportunity.
  // Consider the following data points carefully:

  // Token Metrics:
  // ${JSON.stringify(tokenData, null, 2)}

  // Market Signals:
  // ${JSON.stringify(signals, null, 2)}

  // Top Trader Activities:
  // ${JSON.stringify(traders, null, 2)}

  // Special Considerations:
  // ${promptModifiers.join('\n')}

  // Based on this data and the special considerations above, provide a trading decision in JSON format with:
  // 1. action: "BUY", "SELL", or "HOLD"
  // 2. confidence: number between 0-1
  // 3. reasoning: brief explanation
  // 4. riskFactors: array of identified risk factors
  // 5. positionSizing: recommended position size as percentage of portfolio (0-100)`;

  //         const response = await this.client.messages.create({
  //             model: 'claude-2',
  //             max_tokens: 1000,
  //             messages: [{ role: 'user', content: basePrompt }]
  //         });

  //         try {

  //             const result = JSON.parse(response.content[0].text);
  //             return {
  //                 ...result,
  //                 confidence: result.confidence || 0,
  //                 riskFactors: result.riskFactors || [],
  //                 positionSizing: result.positionSizing || 10 // Default 10%
  //             };
  //         } catch (error) {
  //             console.error('Error parsing AI response:', error);
  //             return {
  //                 action: 'HOLD',
  //                 confidence: 0,
  //                 reasoning: 'Error in analysis',
  //                 riskFactors: ['Analysis error'],
  //                 positionSizing: 0
  //             };
  //         }
  //     }

  async validateTrade(
    signal: any,
    historicalData: any,
    tokenConfig?: any
  ): Promise<boolean> {
    const prompt = `Validate this trade:
Signal: ${JSON.stringify(signal)}
Historical Data: ${JSON.stringify(historicalData)}
Token Configuration: ${JSON.stringify(tokenConfig)}

Consider the token configuration carefully, including any position limits, stop loss, or take profit levels.
Return true only if this trade appears safe, legitimate, and complies with the token configuration.`;

    const response = await this.client.messages.create({
      model: "claude-2",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    let isTradeValid = true;
    response.content.forEach((content) => {
      if (content.type === "text") {
        isTradeValid = content.text.toLowerCase().includes("true");
      }
    });

    return isTradeValid;
  }
} 