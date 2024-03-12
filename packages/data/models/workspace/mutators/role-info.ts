import { produce } from "immer";
import { WorkspaceRoleMutation } from "./types";
import { Role, RoleSchema } from "../../..";

export interface RoleInfoUpdate extends WorkspaceRoleMutation {
  update: {
    name: Role["name"];
    color: Role["color"];
  };
}

export function updateRoleInfo({ structure, update, roleId }: RoleInfoUpdate) {
  // 1. Validate the update request
  const validatedFields = RoleSchema.pick({
    color: true,
    name: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid role update data");

  const {
    data: { name, color },
  } = validatedFields;

  // 2. Check if role already exists
  const roleIdx = structure.roles.findIndex((r) => r.id === roleId);

  if (roleIdx === -1) throw new Error("Role does not exist");

  // 3. Update the role
  const newStructure = produce(structure, (draft) => {
    const curRole = draft.roles[roleIdx]!;
    if (name) curRole.name = name;
    if (color) curRole.color = color;
  });

  return newStructure;
}
