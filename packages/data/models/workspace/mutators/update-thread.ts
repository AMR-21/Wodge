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

interface CreateTeamArgs {
  thread: Thread;
  teamId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function updateThreadMutation({
  thread,
  teamId,
  structure,
}: CreateTeamArgs) {
  // Validate the data
  const validateFields = ThreadSchema.safeParse(thread);

  if (!validateFields.success) throw new Error("Invalid page data");

  const { data: newThread } = validateFields;

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");
    // Check if folder not found

    const threadIdx = team.threads.findIndex((ch) => ch.id === newThread.id);
    if (threadIdx === -1) {
      throw new Error("Page not found");
    } else {
      // check that every group id on the new page exists the workspace structure
      newThread.editGroups.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;
        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });
      newThread.viewGroups.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;
        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });

      team.threads[threadIdx]! = newThread; // Add page
    }
  });
  return newStructure as WorkspaceStructure;
}
