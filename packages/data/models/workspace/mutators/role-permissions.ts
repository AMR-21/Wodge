import { produce } from "immer";
import { WorkspaceRoleMutation } from "./types";
import { Role, RoleSchema } from "../../..";

interface UpdateRolePermissionsArgs extends WorkspaceRoleMutation {
  update: { permissions: Role["permissions"] };
}

export function addRolePermissions({
  structure,
  update,
  roleId,
}: UpdateRolePermissionsArgs) {
  // 1. Validate the update request
  const validatedFields = RoleSchema.pick({
    permissions: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid role update data");

  const {
    data: { permissions },
  } = validatedFields;

  // 2. Check if role already exists
  const roleIdx = structure.roles.findIndex((r) => r.id === roleId);

  if (roleIdx === -1) throw new Error("Role does not exist");

  // 3. Update the permissions
  const newStructure = produce(structure, (draft) => {
    const curRole = draft.roles[roleIdx]!;
    curRole.permissions = Array.from(
      new Set([...curRole.permissions, ...permissions])
    );
  });

  return newStructure;
}

export function removeRolePermissions({
  structure,
  update,
  roleId,
}: UpdateRolePermissionsArgs) {
  // 1. Validate the update request
  const validatedFields = RoleSchema.pick({
    permissions: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid role update data");

  const {
    data: { permissions },
  } = validatedFields;

  // 2. Check if role already exists
  const roleIdx = structure.roles.findIndex((r) => r.id === roleId);

  if (roleIdx === -1) throw new Error("Role does not exist");

  // 3. Update the permissions
  const newStructure = produce(structure, (draft) => {
    const curRole = draft.roles[roleIdx]!;
    curRole.permissions = curRole.permissions.filter(
      (p) => !permissions.includes(p)
    );
  });

  return newStructure;
}
