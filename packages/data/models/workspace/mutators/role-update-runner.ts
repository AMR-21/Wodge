import { Role } from "../../..";
import { updateRoleInfoMutation } from "./role-info";
import {
  addRoleMembersMutation,
  removeRoleMembersMutation,
} from "./role-members";
import {
  addRolePermissionsMutation,
  removeRolePermissionsMutation,
} from "./role-permissions";

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
    }
  | {
      action: "addPermissions" | "removePermissions";
      update: { permissions: Role["permissions"] };
    };

interface RoleUpdateArgs extends WorkspaceRoleMutation {
  roleUpdate: RoleUpdate;
  curMembers: string[];
}

export function teamUpdateRunner({
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

    case "addPermissions":
      return addRolePermissionsMutation({ update, roleId, structure });

    case "removePermissions":
      return removeRolePermissionsMutation({ update, roleId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
