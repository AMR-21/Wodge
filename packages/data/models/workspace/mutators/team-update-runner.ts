import { Team } from "../../..";
import { addTeamDirs, deleteTeamDirs } from "./team-dirs";
import { TeamInfoUpdate, updateTeamInfo } from "./team-info";
import { addTeamMembers, removeTeamMembers } from "./team-members";
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
      action: "addDirs" | "removeDirs";
      update: { dirs: Team["dirs"] };
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
      return updateTeamInfo({ update, teamId, structure });

    case "addMembers":
      return addTeamMembers({
        update,
        teamId,
        structure,
        curMembers,
      });

    case "removeMembers":
      return removeTeamMembers({ update, teamId, structure });

    case "addDirs":
      return addTeamDirs({ update, teamId, structure });

    case "removeDirs":
      return deleteTeamDirs({ update, teamId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
