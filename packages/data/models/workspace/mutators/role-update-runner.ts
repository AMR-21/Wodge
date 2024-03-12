import { Role } from "../../..";
import { updateRoleInfo } from "./role-info";
import { addRoleMembers, removeRoleMembers } from "./role-members";
import { addRolePermissions, removeRolePermissions } from "./role-permissions";
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
      return updateRoleInfo({ update, roleId, structure });

    case "addMembers":
      return addRoleMembers({
        update,
        roleId,
        structure,
        curMembers,
      });

    case "removeMembers":
      return removeRoleMembers({ update, roleId, structure });

    case "addPermissions":
      return addRolePermissions({ update, roleId, structure });

    case "removePermissions":
      return removeRolePermissions({ update, roleId, structure });

    default:
      throw new Error("Invalid update action");
  }
}
