import { produce } from "immer";
import {
  DrObj,
  Room,
  RoomSchema,
  TEAM_MEMBERS_ROLE,
  Thread,
  ThreadSchema,
} from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

interface UpdateThreadsArgs {
  thread: Thread;
  teamId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  userId: string;
}

export function updateThreadMutation({
  thread,
  teamId,
  structure,
  userId,
}: UpdateThreadsArgs) {
  // Validate the data
  const validateFields = ThreadSchema.safeParse(thread);

  if (!validateFields.success) throw new Error("Invalid page data");

  const { data: newThread } = validateFields;

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");
    // Check if folder not found

    if (thread.createdBy !== userId)
      throw new Error("You are not the creator of this thread");

    const threadIdx = team.threads.findIndex((ch) => ch.id === newThread.id);
    if (threadIdx === -1) {
      throw new Error("Page not found");
    } else {
      team.threads[threadIdx]! = newThread; // Add page
    }
  });
  return newStructure as WorkspaceStructure;
}
