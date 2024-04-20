import { produce } from "immer";
import { DrObj, TEAM_MEMBERS_ROLE, Thread, ThreadSchema } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

interface ToggleThreadArgs {
  threadId: string;
  teamId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  curUserId: string;
  isAdmin: boolean;
}

export function toggleThreadMutation({
  threadId,
  teamId,
  structure,
  curUserId,
  isAdmin,
}: ToggleThreadArgs) {
  // Validate the data

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");

    const thread = team.threads.find((ch) => ch.id === threadId);

    // Check if thread already exists
    if (!thread) {
      throw new Error("Thread already exists");
    } else {
      if (!isAdmin && curUserId !== thread?.createdBy)
        throw new Error("You are not the creator of this thread");
      thread.isResolved = !thread.isResolved;
    }
  });
  return newStructure as WorkspaceStructure;
}
