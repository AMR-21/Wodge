import { Group } from "../../../schemas/workspace.schema";
import { updateGroupInfoMutation } from "./group-info";
import {
  addGroupMembersMutation,
  removeGroupMembersMutation,
} from "./group-members";
import { WorkspaceGroupMutation } from "./types";

export type GroupUpdate =
  | {
      action: "updateInfo";
      update: {
        name: Group["name"];
        color: Group["color"];
      };
    }
  | {
      action: "addMembers" | "removeMembers";
      update: { members: Group["members"] };
    };

export interface GroupUpdateRunnerArgs extends WorkspaceGroupMutation {
  groupUpdate: GroupUpdate;
  curMembers: string[];
}

export function groupUpdateRunner({
  groupUpdate,
  structure,
  groupId,
  curMembers,
}: GroupUpdateRunnerArgs) {
  if (!groupUpdate.action) throw new Error("Invalid update action");

  const { action, update } = groupUpdate;

  switch (action) {
    case "updateInfo":
      return updateGroupInfoMutation({ update, groupId, structure });

    case "addMembers":
      return addGroupMembersMutation({
        update,
        groupId,
        structure,
        curMembers,
      });

    case "removeMembers":
      return removeGroupMembersMutation({ update, groupId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
