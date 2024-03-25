import { produce } from "immer";
import { DrObj } from "../../..";
import {
  Thread,
  ThreadSchema,
  WorkspaceStructure,
} from "../../../schemas/workspace.schema";

interface CreateTeamArgs {
  thread: Thread;
  teamId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createThreadMutation({
  thread,
  teamId,
  structure,
}: CreateTeamArgs) {
  // Validate the data
  const validateFields = ThreadSchema.safeParse(thread);

  if (!validateFields.success) throw new Error("Invalid thread data");

  const { data: newThread } = validateFields;

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");

    // Check if thread already exists
    if (team.threads.find((ch) => ch.id === newThread.id)) {
      throw new Error("Thread already exists");
    } else {
      team.threads.push(newThread); // Add thread
    }
  });
  return newStructure as WorkspaceStructure;
}
