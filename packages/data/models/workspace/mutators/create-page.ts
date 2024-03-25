import { produce } from "immer";
import { DrObj } from "../../..";
import {
  Page,
  PageSchema,
  WorkspaceStructure,
} from "../../../schemas/workspace.schema";

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
      fold?.channels.push(newPage); // Add page
    }
  });
  return newStructure as WorkspaceStructure;
}
