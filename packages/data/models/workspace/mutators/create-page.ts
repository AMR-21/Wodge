import { produce } from "immer";
import { DrObj, Page, PageSchema, TEAM_MEMBERS_ROLE } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";
import { group } from "console";

interface CreateTeamArgs {
  page: Page;
  teamId: string;
  folderId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createPageMutation({
  page,
  folderId,
  teamId,
  structure,
}: CreateTeamArgs) {
  // Validate the data
  const validateFields = PageSchema.safeParse(page);

  if (!validateFields.success) throw new Error("Invalid page data");

  const { data: newPage } = validateFields;

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    // Check if team not found
    if (!team) throw new Error("Team not found");
    // Check if folder not found
    const fold = team?.folders.find((f) => f.id === folderId);
    if (!fold) throw new Error("Folder not found");
    // Check if channel already exists
    if (fold.channels.find((ch) => ch.id === newPage.id)) {
      throw new Error("Page already exists");
    } else {
      // check that every group id on the new page exists the workspace structure
      newPage.editRoles.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;
        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });
      newPage.viewRoles.forEach((groupId) => {
        if (groupId === TEAM_MEMBERS_ROLE) return;
        if (!draft.groups.find((g) => g.id === groupId)) {
          throw new Error("Group not found");
        }
      });

      fold?.channels.push(newPage); // Add page
    }
  });
  return newStructure as WorkspaceStructure;
}
