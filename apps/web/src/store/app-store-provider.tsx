"use client";

import { createContext, useContext, useRef } from "react";
import { StoreApi, useStore } from "zustand";
import { AppStore, createAppStore } from "./app-store";

export const AppStoreContext = createContext<StoreApi<AppStore> | null>(null);

export interface AppStoreProviderProps {
  children: React.ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<StoreApi<AppStore>>();

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }
  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const appStoreContext = useContext(AppStoreContext);
  if (!appStoreContext)
    throw new Error("useAppStore must be used within a AppStoreProvider");

  return useStore(appStoreContext, selector);
};
