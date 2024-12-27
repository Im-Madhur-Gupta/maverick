// multiple personas -> user can choose

// add buy signal support

import axios, { AxiosResponse } from "axios";
import { AgentHolding } from "./data";

interface CreateAgentParams {
  fereUserId: string;
  name: string;
  description: string;
  persona: string;
  dataSource: string;
  decisionPromptPool: any;
  decisionPromptPortfolio: any;
  twitterUsername?: string;
  fcUsername?: string;
  simulation?: boolean;
  simulationInitialUsd?: number;
  maxInvestmentPerSession?: number;
  stopLoss?: number;
  trailingStopLoss?: number;
  takeProfit?: number;
}

interface UpdateAgentPayload {
  userId: string;
  name: string;
  description: string;
  persona: string;
  dataSource: string;
  decisionPromptPool: string;
  decisionPromptPortfolio: string;
  twitterUsername?: string;
  fcUsername?: string;
  dryRun?: boolean;
  dryRunInitialUsd?: number;
  maxInvestmentPerSession?: number;
  stopLoss?: number;
  trailingStopLoss?: number;
  takeProfit?: number;
}

interface Disciple {
  name: string;
  id: string;
}

export class FereAgent {
  private fereApiKey: string;
  fereUserId: string;
  private baseUrl: string = "https://api.fereai.xyz/ta";

  constructor(fereApiKey: string, fereUserId: string) {
    this.fereApiKey = fereApiKey;
    this.fereUserId = fereUserId;
  }

  private getApiHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      "X-FRIDAY-KEY": this.fereApiKey,
    };
  }

  async createAgent(params: CreateAgentParams): Promise<any | null> {
    const url = `${this.baseUrl}/agent/`;
    const payload = {
      user_id: params.fereUserId,
      name: params.name,
      description: params.description,
      persona: params.persona,
      data_source: params.dataSource,
      // decision_prompt_pool: params.decisionPromptPool,
      // decision_prompt_portfolio: params.decisionPromptPortfolio,
      twitter_username: params.twitterUsername,
      fc_username: params.fcUsername,
      dry_run: params.simulation || false,
      dry_run_initial_usd: params.simulationInitialUsd || 0,
      max_investment_per_session: params.maxInvestmentPerSession || 0,
      stop_loss: params.stopLoss || 0,
      trailing_stop_loss: params.trailingStopLoss || 0,
      take_profit: params.takeProfit || 0,
    };

    try {
      const response: AxiosResponse = await axios.put(url, payload, {
        headers: this.getApiHeaders(),
        maxBodyLength: Infinity,
      });

      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error("Request failed:", error);
      return null;
    }
  }

  async fetchDisciples(): Promise<Disciple[]> {
    const url = `${this.baseUrl}/ta/agent/${this.fereUserId}/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error(`Request failed: ${error}`);
      return [];
    }
  }

  async getPortfolio(discipleAgentId: string): Promise<any | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/portfolio/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async getHoldings(discipleAgentId: string): Promise<AgentHolding[] | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/holdings/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async getTrades(discipleAgentId: string): Promise<any[] | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/trades/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async getTradeRecommendations(
    discipleAgentId: string
  ): Promise<any[] | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/decisions/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async getOptimalGains(discipleAgentId: string): Promise<any | void> {
    const url = `${this.baseUrl}/ta/agent/${discipleAgentId}/buy/`;

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async sellHolding(
    discipleAgentId: string,
    holdingId: string,
    quantity: number
  ): Promise<any | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/sell/f${holdingId}/f${quantity}/`;
    const payload = {};

    try {
      const response: AxiosResponse = await axios.post(url, payload, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async getTaskStatus(taskId: string): Promise<any | void> {
    const url = `${this.baseUrl}/task/status/${taskId}/`;
    const payload = {};

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async updateAgent(
    discipleId: string,
    payload: UpdateAgentPayload
  ): Promise<any | void> {
    const url = `${this.baseUrl}/agent/${discipleId}/`;

    try {
      const response: AxiosResponse = await axios.patch(url, payload, {
        headers: this.getApiHeaders(),
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }

  async deleteDisciple(discipleAgentId: string): Promise<any | void> {
    const url = `${this.baseUrl}/agent/${discipleAgentId}/`;
    const payload = {};

    try {
      const response: AxiosResponse = await axios.delete(url, {
        headers: this.getApiHeaders(),
        data: payload,
      });

      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Request failed: ${error}`);
    }
  }
}
