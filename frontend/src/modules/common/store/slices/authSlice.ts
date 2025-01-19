import { StateCreator } from "zustand";
import { ApiService } from "@/services/api/api.service";
import { useAppStore } from "@/modules/common/store/use-app-store";

export interface AuthState {
  isAuthenticated: boolean;
  solanaAddress: string | null;
}

export interface AuthActions {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setSolanaAddress: (solanaAddress: string) => void;
  checkAuthentication: () => Promise<void>;
  generateSignatureMessage: (solanaAddress: string) => Promise<string>;
  login: (
    solanaAddress: string,
    signatureMessage: string,
    signature: string
  ) => Promise<void>;
  logout: () => void;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  solanaAddress: null,

  setIsAuthenticated: (isAuthenticated: boolean): void => {
    set({ isAuthenticated });
  },

  setSolanaAddress: (solanaAddress: string): void => {
    set({ solanaAddress });
  },

  checkAuthentication: async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const agentId = localStorage.getItem("agentId");

      if (!accessToken || !agentId) {
        set({ isAuthenticated: false });
        return;
      }

      await useAppStore.getState().fetchAgent();

      set({ isAuthenticated: true });

      await useAppStore.getState().fetchPortfolio();
    } catch (error) {
      console.error("Error checking authentication", error);
      set({ isAuthenticated: false });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("agentId");
    }
  },

  generateSignatureMessage: async (solanaAddress: string): Promise<string> => {
    try {
      const api = ApiService.getInstance();
      return api.generateSignatureMessage(solanaAddress);
    } catch (error) {
      console.error("Error generating signature message:", error);
      throw error;
    }
  },

  login: async (
    solanaAddress: string,
    signatureMessage: string,
    signature: string
  ) => {
    try {
      const api = ApiService.getInstance();
      const accessToken = await api.generateAccessToken({
        solanaAddress,
        signatureMessage,
        signature,
      });

      // TODO: Remove this once we have a proper auth flow
      localStorage.setItem("accessToken", accessToken);

      set({ isAuthenticated: true, solanaAddress });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: (): void => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("agentId");
      set({ isAuthenticated: false, solanaAddress: null });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },
});
