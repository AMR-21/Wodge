"use client";

import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

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

export const useAppState = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        isSidebarOpen: true,
        toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
        openTeams: [],
        setOpenTeams: (teams: string[]) => set({ openTeams: teams }),
        openDirs: [],
        setOpenDirs: (dirs: string[]) => set({ openDirs: dirs }),
      }),

      {
        name: "app-state",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isSidebarOpen: state.isSidebarOpen,
          openTeams: state.openTeams,
          openDirs: state.openDirs,
        }),
      },
    ),
  ),
);
