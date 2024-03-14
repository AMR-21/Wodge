"use client";

import {
  DrObj,
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
import { Mutable } from "@/lib/utils";

interface WorkspaceContext {
  metadata: WorkspaceType;
  members: Mutable<DrObj<WorkspaceMembers>>;
  structure: Mutable<DrObj<WorkspaceStructure>>;
  inviters?: (Pick<Member, "id" | "data"> | undefined)[];
  workspace?: Workspace;
}

const Context = createContext<WorkspaceContext | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const data = {};

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
