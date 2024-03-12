import { produce } from "immer";
import { WorkspaceRoleMutation } from "./types";
import { Role, RoleSchema } from "../../..";

interface UpdateRoleArgs extends WorkspaceRoleMutation {
  update: {
    members: Role["members"];
  };
}

export function addRoleMembersMutation({
  update,
  structure,
  roleId,
  curMembers,
}: UpdateRoleArgs & { curMembers: string[] }) {
  // 1. Validate the update request
  const validatedFields = RoleSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid role update data");

  // 2. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 2. Check if the added members exist in the current workspace
  const invalidMembers = members.filter((m) => !curMembers.includes(m));

  if (invalidMembers.length > 0) throw new Error("Invalid members");

  // 3. Check if role already exists
  const roleIdx = structure.roles.findIndex((r) => r.id === roleId);

  if (roleIdx === -1) throw new Error("Role does not exist");

  // 4. Update the role
  const newStructure = produce(structure, (draft) => {
    const curRole = draft.roles[roleIdx]!;

    // Account for duplicate updates - in case of conflicts
    curRole.members = Array.from(new Set([...curRole.members, ...members]));
  });

  return newStructure;
}

export function removeRoleMembersMutation({
  update,
  structure,
  roleId,
}: UpdateRoleArgs) {
  // 1. Validate the update request
  const validatedFields = RoleSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid role update data");

  // 1. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 2. Check if role already exists
  const roleIdx = structure.roles.findIndex((r) => r.id === roleId);

  if (roleIdx === -1) throw new Error("Role does not exist");

  // 3. Update the team
  const newStructure = produce(structure, (draft) => {
    const curRole = draft.roles[roleIdx]!;

    curRole.members = curRole.members.filter((m) => !members.includes(m));
  });

  return newStructure;
}
