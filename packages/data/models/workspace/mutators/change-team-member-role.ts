import { produce } from "immer";
import { WorkspaceTeamMutation } from "./types";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

interface ChangeTeamMemberRoleMutationArgs extends WorkspaceTeamMutation {
  update: {
    memberId: string;
    role: "teamMember" | "moderator";
  };
}

export function changeTeamMemberRoleMutation({
  update,
  teamId,
  structure,
}: ChangeTeamMemberRoleMutationArgs) {
  const { role, memberId } = update;

  const team = structure.teams.find((t) => t.id === teamId);

  if (!team) throw new Error("Team not found");

  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);
  if (teamIdx === -1) throw new Error("Member not found");

  if (role !== "moderator" && role !== "teamMember")
    throw new Error("Invalid role");

  return produce(structure, (draft) => {
    const team = draft.teams[teamIdx]!;

    if (role === "moderator") {
      team.moderators.push(memberId);
    } else {
      team.moderators = team.moderators.filter((m) => m !== memberId);
    }
  }) as WorkspaceStructure;
}
