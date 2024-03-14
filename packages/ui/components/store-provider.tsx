"use client";

import React, { createContext, useContext, useRef } from "react";
import { StoreApi, useStore } from "zustand";
import { AppState, createAppState } from "..";

export const AppStateContext = createContext<StoreApi<AppState> | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<StoreApi<AppState>>();
  if (!storeRef.current) {
    storeRef.current = createAppState();
  }

  return (
    <AppStateContext.Provider value={storeRef.current}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateStore = <T,>(selector: (store: AppState) => T): T => {
  const appStateStore = useContext(AppStateContext);

  if (!appStateStore) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(appStateStore, selector);
};
