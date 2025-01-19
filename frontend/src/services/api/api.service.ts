import axios, { AxiosInstance } from "axios";
import {
  AccessTokenResponse,
  PortfolioResponse,
  ProcessedSignal,
} from "./types";
import { Portfolio } from "./types";
import { Holding } from "./types";
import { Agent } from "./types";
import { SignatureMessageResponse } from "./types";
import { SafeAgent } from "@/services/api/types";

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    this.api = axios.create({
      baseURL: baseURL,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token expiry
          localStorage.removeItem("accessToken");
          console.log("Token expired, redirecting to onboarding page");
          window.location.href = "/onboarding";
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async generateSignatureMessage(solanaAddress: string): Promise<string> {
    const { data } = await this.api.post<SignatureMessageResponse>(
      "/auth/generate-signature-message",
      { solanaAddress }
    );
    return data.message;
  }

  async generateAccessToken(params: {
    solanaAddress: string;
    signatureMessage: string;
    signature: string;
  }): Promise<string> {
    const { data } = await this.api.post<AccessTokenResponse>(
      "/auth/generate-access-token",
      params
    );
    return data.accessToken;
  }

  async createAgent(params: {
    name: string;
    description: string;
    persona: number;
  }): Promise<Agent> {
    const { data } = await this.api.post<Agent>("/agents/create", params);
    return data;
  }

  async getAgents(): Promise<SafeAgent[]> {
    const { data } = await this.api.get<{ agents: SafeAgent[] }>("/agents");
    return data.agents;
  }

  async getHoldings(agentId: string): Promise<Holding[]> {
    const { data } = await this.api.get<{ holdings: Holding[] }>(
      `/agents/${agentId}/holdings`
    );
    return data.holdings;
  }

  async getPortfolio(agentId: string): Promise<Portfolio> {
    const { data } = await this.api.get<PortfolioResponse>(
      `/agents/${agentId}/portfolio`
    );

    // TODO: API response should be in camelCase
    return {
      id: data.id,
      agentId: data.agent_id,
      startTime: data.start_time,
      startUsd: data.start_usd,
      currRealisedUsd: data.curr_realised_usd,
      currUnrealisedUsd: data.curr_unrealised_usd,
      dryRun: data.dry_run,
    };
  }

  async getProcessedCoinSignals(agentId: string): Promise<ProcessedSignal[]> {
    const { data } = await this.api.get<{ signals: ProcessedSignal[] }>(
      `/coin-signals/${agentId}`
    );
    return data.signals;
  }
}
