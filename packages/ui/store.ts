"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { PublicUserType } from "@repo/data";

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openTeams: string[];
  setOpenTeams: (teams: string[]) => void;
  openDirs: string[];
  setOpenDirs: (dirs: string[]) => void;
  // user: PublicUserType;
  // setUser: (user: PublicUserType) => void;
}

export const useAppState = create(
  persist<AppState>(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
      openTeams: [],
      setOpenTeams: (teams: string[]) => set({ openTeams: teams }),
      openDirs: [],

      setOpenDirs: (dirs: string[]) => set({ openDirs: dirs }),

      // user: get().user,
      // setUser: (user: PublicUserType) => set({ user }),
    }),

    {
      name: "app-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
