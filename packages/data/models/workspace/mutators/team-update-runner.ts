import { DrObj, Team, WorkspaceStructure } from "../../..";
import {
  addTeamFoldersMutation,
  deleteTeamFoldersMutation,
} from "./team-folders";
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
      action: "addFolders";
      update: { folders: Team["folders"] };
    }
  | {
      action: "removeFolders";
      update: { folders: string[] };
    };

export interface TeamUpdateRunnerArgs extends WorkspaceTeamMutation {
  teamUpdate: TeamUpdate;
  curMembers: string[];
}

export function teamUpdateRunner({
  teamUpdate,
  structure,
  teamId,
  curMembers,
}: TeamUpdateRunnerArgs): WorkspaceStructure | DrObj<WorkspaceStructure> {
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

    case "addFolders":
      return addTeamFoldersMutation({ update, teamId, structure });

    case "removeFolders":
      return deleteTeamFoldersMutation({ update, teamId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
