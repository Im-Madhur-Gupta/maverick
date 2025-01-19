"use client";

import { ReactNode, useRef } from "react";
import { useAppStore } from "@/modules/common/store/use-app-store";

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    initialized.current = true;
    useAppStore.getState().checkAuthentication();
  }

  return <>{children}</>;
}
