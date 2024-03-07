"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { PublicUserType } from "@repo/data";

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  // user: PublicUserType;
  // setUser: (user: PublicUserType) => void;
}

export const useAppState = create(
  persist<AppState>(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),

      // user: get().user,
      // setUser: (user: PublicUserType) => set({ user }),
    }),

    {
      name: "app-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
