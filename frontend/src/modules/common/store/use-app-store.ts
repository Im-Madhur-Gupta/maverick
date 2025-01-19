import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createAuthSlice,
  AuthSlice,
} from "@/modules/common/store/slices/authSlice";
import {
  createAgentSlice,
  AgentSlice,
} from "@/modules/dashboard/slices/agentSlice";

interface StoreState extends AuthSlice, AgentSlice {}

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createAgentSlice(...a),
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        solanaAddress: state.solanaAddress,
      }),
    }
  )
);
