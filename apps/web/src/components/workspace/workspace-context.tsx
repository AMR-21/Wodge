"use client";

import {
  Member,
  PublicUserType,
  Workspace,
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
  WorkspacesRegistry,
} from "@repo/data";
import { useCurrentWsData, useUserWorkspaces } from "@repo/ui";
import { createContext, useContext, useEffect, useState } from "react";
import { DeepReadonly } from "replicache";

import usePartySocket from "partysocket/react";
import { env } from "@repo/env";
import { useParams, useRouter } from "next/navigation";
import PartySocket from "partysocket";

interface WorkspaceContext {
  metadata?: WorkspaceType;
  members?: DeepReadonly<WorkspaceMembers>;
  structure?: DeepReadonly<WorkspaceStructure>;
  inviters?: (Pick<Member, "id" | "data"> | undefined)[];
  // ws: PartySocket;
  workspace?: Workspace;
}

const Context = createContext<WorkspaceContext | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const data = useCurrentWsData();

  return (
    <Context.Provider
      value={{
        ...data,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCurrentWorkspace() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useCurrentWorkspace must be used within a WorkspaceProvider",
    );
  }

  return context;
}
