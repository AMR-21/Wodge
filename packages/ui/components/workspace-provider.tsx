import {
  DrObj,
  Member,
  Workspace,
  WorkspaceMembers,
  WorkspaceStructure,
} from "@repo/data";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import { createContext } from "react";
import { Replicache } from "replicache";
import { useWorkspaceSubscription } from "..";
import { useParams } from "next/navigation";

interface WorkspaceContextProps {
  workspaceRep: Replicache<typeof workspaceMutators> | null;
  workspace: Workspace | undefined;
  structure: DrObj<WorkspaceStructure>;
  members: DrObj<WorkspaceMembers>;
  workspaceId: string | undefined;
  workspaceSlug: string | undefined;
  isStructurePending: boolean;
  isMembersPending: boolean;
}

export const WorkspaceContext = createContext<
  WorkspaceContextProps | undefined
>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const workspaceInfo = useWorkspaceSubscription();
  return (
    <WorkspaceContext.Provider value={workspaceInfo}>
      {children}
    </WorkspaceContext.Provider>
  );
}
