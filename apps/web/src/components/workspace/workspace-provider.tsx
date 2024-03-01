"use client";

import {
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data";
import { useCurrentWsData } from "@repo/ui";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { DeepReadonly } from "replicache";
import { set } from "zod";

interface WorkspaceContext {
  metadata?: WorkspaceType;
  members?: DeepReadonly<WorkspaceMembers>;
  structure?: DeepReadonly<WorkspaceStructure>;
}

const Context = createContext<WorkspaceContext | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
