import { StateCreator } from "zustand";
import { ApiService } from "@/services/api/api.service";
import { PersonaId } from "@/modules/common/enums/persona-id.enum";
import type {
  SafeAgent,
  Holding,
  Portfolio,
  ProcessedSignal,
} from "@/services/api/types";

interface AgentState {
  agent: SafeAgent | null;
  isAgentLoading: boolean;
  portfolio: Portfolio | null;
  isPortfolioLoading: boolean;
  holdings: Holding[];
  isHoldingsLoading: boolean;
  processedSignals: ProcessedSignal[];
  isProcessedSignalsLoading: boolean;
}

interface AgentActions {
  createAgent: (params: {
    name: string;
    description: string;
    persona: PersonaId;
  }) => Promise<void>;
  fetchAgent: () => Promise<void>;
  fetchHoldings: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  fetchProcessedSignals: () => Promise<void>;
}

export type AgentSlice = AgentState & AgentActions;

export const createAgentSlice: StateCreator<AgentSlice> = (set, get) => ({
  agent: null,
  isAgentLoading: true,

  portfolio: null,
  isPortfolioLoading: true,

  holdings: [],
  isHoldingsLoading: true,

  processedSignals: [],
  isProcessedSignalsLoading: true,

  fetchAgent: async (): Promise<void> => {
    try {
      set({ isAgentLoading: true });

      const api = ApiService.getInstance();
      const agents = await api.getAgents();

      if (agents.length === 0) {
        throw new Error("No agents found");
      }

      // TODO: For now, we are assuming that there is only one agent per user
      const agent = agents[0];

      set({ agent });
    } finally {
      set({ isAgentLoading: false });
    }
  },

  createAgent: async (params) => {
    try {
      set({ isAgentLoading: true });

      const api = ApiService.getInstance();
      const agent = await api.createAgent(params);

      // TODO: Remove this once we have a proper auth flow
      localStorage.setItem("agentId", agent.id);

      set({ agent });

      await get().fetchPortfolio();
    } finally {
      set({ isAgentLoading: false });
    }
  },

  fetchPortfolio: async () => {
    try {
      const agent = get().agent;
      if (agent === null) {
        console.error("Agent not found");
        return;
      }

      set({ isPortfolioLoading: true });
      const api = ApiService.getInstance();
      const portfolio = await api.getPortfolio(agent.id);

      set({ portfolio });
    } finally {
      set({ isPortfolioLoading: false });
    }
  },

  fetchHoldings: async (): Promise<void> => {
    try {
      const agent = get().agent;
      if (agent === null) {
        console.error("Agent not found");
        return;
      }

      set({ isHoldingsLoading: true });

      const api = ApiService.getInstance();
      const holdings = await api.getHoldings(agent.id);

      set({ holdings });
    } finally {
      set({ isHoldingsLoading: false });
    }
  },

  fetchProcessedSignals: async (): Promise<void> => {
    try {
      const agent = get().agent;
      if (agent === null) {
        console.error("Agent not found");
        return;
      }

      set({ isProcessedSignalsLoading: true });

      const api = ApiService.getInstance();
      const processedSignals = await api.getProcessedCoinSignals(agent.id);

      set({ processedSignals });
    } finally {
      set({ isProcessedSignalsLoading: false });
    }
  },
});
