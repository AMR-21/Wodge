import { produce } from "immer";
import { WorkspaceTeamMutation } from "./types";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

export function deleteFolderMutation({
  structure,
  teamId,
  folderId,
}: WorkspaceTeamMutation & { folderId: string }) {
  const newStructure = produce(structure, (draft) => {
    // Check if the team not existing
    const teamIdx = draft.teams.findIndex((t) => t.id === teamId);
    if (teamIdx === -1) throw new Error("Team not found");

    const team = draft.teams[teamIdx]!;

    const folderIdx = team.folders.findIndex((f) => f.id === folderId);
    if (folderIdx === -1) throw new Error("Folder not found");

    draft.teams[teamIdx]!.folders = team.folders.filter(
      (f) => f.id !== folderId
    );
  });

  return newStructure as WorkspaceStructure;
}
