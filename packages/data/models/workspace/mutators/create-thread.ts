import { produce } from "immer";
import { DrObj, TEAM_MEMBERS_ROLE, Thread, ThreadSchema } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

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
      // check that every group id on the new page exists the workspace structure
      newThread.editRoles.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;

        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });
      newThread.viewRoles.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;

        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });
      team.threads.push(newThread); // Add thread
    }
  });
  return newStructure as WorkspaceStructure;
}
