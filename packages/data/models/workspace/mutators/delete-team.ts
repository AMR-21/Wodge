import { produce } from "immer";
import { WorkspaceTeamMutation } from "./types";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

export function deleteTeamMutation({
  structure,
  teamId,
}: WorkspaceTeamMutation) {
  // 1. check if the team not existing
  const teamExists = structure.teams.some((t) => t.id === teamId);

  if (!teamExists) throw new Error("Team not found");

  // 2. Delete the team
  const newStructure = produce(structure, (draft) => {
    draft.teams = draft.teams.filter((t) => t.id !== teamId);
  });

  return newStructure as WorkspaceStructure;
}
