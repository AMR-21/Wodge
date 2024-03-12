import { Team } from "../../..";
import { addTeamDirsMutation, deleteTeamDirsMutation } from "./team-dirs";
import { updateTeamInfoMutation } from "./team-info";
import { addTeamMembersMutation, removeTeamMembers } from "./team-members";
import { WorkspaceTeamMutation } from "./types";

export type UpdatableTeamFields = Omit<Team, "id" | "createdBy">;

export type TeamUpdate =
  | {
      action: "updateInfo";
      update: {
        name: Team["name"];
        avatar: Team["avatar"];
      };
    }
  | {
      action: "addMembers" | "removeMembers";
      update: { members: Team["members"] };
    }
  | {
      action: "addDirs";
      update: { dirs: Team["dirs"] };
    }
  | {
      action: "removeDirs";
      update: { dirs: string[] };
    };

export interface TeamUpdateArgs extends WorkspaceTeamMutation {
  teamUpdate: TeamUpdate;
  curMembers: string[];
}

export function teamUpdateRunner({
  teamUpdate,
  structure,
  teamId,
  curMembers,
}: TeamUpdateArgs) {
  if (!teamUpdate.action) throw new Error("Invalid update action");

  const { action, update } = teamUpdate;

  switch (action) {
    case "updateInfo":
      return updateTeamInfoMutation({ update, teamId, structure });

    case "addMembers":
      return addTeamMembersMutation({
        update,
        teamId,
        structure,
        curMembers,
      });

    case "removeMembers":
      return removeTeamMembers({ update, teamId, structure });

    case "addDirs":
      return addTeamDirsMutation({ update, teamId, structure });

    case "removeDirs":
      return deleteTeamDirsMutation({ update, teamId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
