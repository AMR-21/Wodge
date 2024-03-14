"use client";

import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

import { WorkspaceType } from "@repo/data";
import { Replicache } from "replicache";
import { userMutators } from "@repo/data/models/user/user-mutators";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import PartySocket from "partysocket";
import { createWorkspaceRep } from "./create-workspace-rep";
import { createSocket } from "./create-socket";

type Environment = WorkspaceType["environment"];

export interface AppState {
  isSidebarOpen: boolean;
  openTeams: string[];
  openDirs: string[];

  userStore?: Replicache<typeof userMutators>;
  workspaces: Record<string, Replicache<typeof workspaceMutators>>;
  socket?: PartySocket;

  actions: {
    setOpenDirs: (dirs: string[]) => void;
    setOpenTeams: (teams: string[]) => void;
    toggleSidebar: () => void;
    addWorkspace: (
      workspace: string,
      environment: Environment,
      userId: string,
    ) => Replicache<typeof workspaceMutators>;
    connectSocket: (userId: string) => void;
  };
}

export const useAppState = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        isSidebarOpen: true,
        openTeams: [],
        openDirs: [],
        userStore: undefined,
        workspaces: {},

        actions: {
          setOpenTeams: (teams: string[]) => set({ openTeams: teams }),
          setOpenDirs: (dirs: string[]) => set(() => ({ openDirs: dirs })),
          toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
          addWorkspace: (workspaceId, environment, userId) => {
            // Closing the current workspace so to account for the case of switching from local to cloud
            if (get().workspaces?.[workspaceId] !== undefined)
              get().workspaces?.[workspaceId]?.close();

            const rep = createWorkspaceRep(userId, workspaceId, environment);

            set({
              workspaces: {
                ...get().workspaces,
                [workspaceId]: rep,
              },
            });

            return rep;
          },

          connectSocket: (userId: string) => {
            if (get().socket) return;

            set({ socket: createSocket(userId) });
          },
        },
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
