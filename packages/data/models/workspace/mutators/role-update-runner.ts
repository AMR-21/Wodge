import { Role } from "../../..";
import { updateRoleInfoMutation } from "./role-info";
import {
  addRoleMembersMutation,
  removeRoleMembersMutation,
} from "./role-members";

import { WorkspaceRoleMutation } from "./types";

export type RoleUpdate =
  | {
      action: "updateInfo";
      update: {
        name: Role["name"];
        color: Role["color"];
      };
    }
  | {
      action: "addMembers" | "removeMembers";
      update: { members: Role["members"] };
    };

interface RoleUpdateArgs extends WorkspaceRoleMutation {
  roleUpdate: RoleUpdate;
  curMembers: string[];
}

export function roleUpdateRunner({
  roleUpdate,
  structure,
  roleId,
  curMembers,
}: RoleUpdateArgs) {
  if (!roleUpdate.action) throw new Error("Invalid update action");

  const { action, update } = roleUpdate;

  switch (action) {
    case "updateInfo":
      return updateRoleInfoMutation({ update, roleId, structure });

    case "addMembers":
      return addRoleMembersMutation({
        update,
        roleId,
        structure,
        curMembers,
      });

    case "removeMembers":
      return removeRoleMembersMutation({ update, roleId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
