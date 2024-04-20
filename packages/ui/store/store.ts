"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Replicache } from "replicache";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import PartySocket from "partysocket";
import { createWorkspaceRep } from "./create-workspace-rep";
import { createSocket } from "./create-socket";
import { userMutators } from "@repo/data/models/user/user-mutators";
import { roomMutators, threadMutators } from "@repo/data";
import { CreateChannelArgs, createChannelRep } from "./create-channel-rep";

type ChannelMutators = typeof roomMutators | typeof threadMutators;
export interface AppState {
  userStore?: Replicache<typeof userMutators>;
  workspaces: Record<string, Replicache<typeof workspaceMutators>>;
  activeChanRep?: Replicache<ChannelMutators>;
  socket?: PartySocket;

  actions: {
    addWorkspace: (
      workspace: string,
      userId: string,
    ) => Replicache<typeof workspaceMutators>;
    connectSocket: (userId: string) => void;
    getWorkspace: (
      workspaceId: string,
      userId: string,
    ) => Replicache<typeof workspaceMutators> | void;
    removeWorkspace: (workspaceId: string) => void;
    setChannelRep: (rep: Replicache<ChannelMutators>) => void;
  };
}

export const useAppState = create<AppState>()(
  devtools((set, get) => ({
    userStore: undefined,
    workspaces: {},

    actions: {
      addWorkspace: (workspaceId, userId) => {
        // Closing the current workspace so to account for the case of switching from local to cloud
        if (get().workspaces?.[workspaceId] !== undefined)
          get().workspaces?.[workspaceId]?.close();

        const rep = createWorkspaceRep(userId, workspaceId);

        set({
          workspaces: {
            ...get().workspaces,
            [workspaceId]: rep,
          },
        });

        return rep;
      },
      getWorkspace: (workspaceId, userId) => {
        if (!workspaceId) return;
        const workspace = get().workspaces[workspaceId];

        if (!workspace) return get().actions.addWorkspace(workspaceId, userId);

        return workspace;
      },
      // Softly delete workspace from the store
      removeWorkspace: async (workspaceId: string) => {
        const workspaces = get().workspaces;

        if (workspaces[workspaceId]) {
          // workaround as close throws an error
          //@ts-ignore
          workspaces[workspaceId]!.puller = undefined;
          //@ts-ignore
          workspaces[workspaceId]!.pusher = undefined;
          // await workspaces[workspaceId]!.close();
        }
        const { workspaceId: _, ...rest } = workspaces;
        set({ ...rest });
      },
      connectSocket: (userId: string) => {
        if (get().socket) return;

        set({ socket: createSocket(userId) });
      },
      setChannelRep: (rep) => {
        set({ activeChanRep: rep });
      },
    },
  })),
);
