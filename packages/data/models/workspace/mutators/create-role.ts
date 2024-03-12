import { produce } from "immer";
import { DrObj, Role, RoleSchema, WorkspaceStructure } from "../../..";

interface CreateRoleArgs {
  // Any to account for the backend mutation runner - relay on zod to validate the data
  role: Pick<Role, "id" | "name" | "createdBy" | "color">;
  currentUserId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createRoleMutation({
  role,
  structure,
  currentUserId,
}: CreateRoleArgs) {
  //1. Validate the data
  const validatedFields = RoleSchema.pick({
    id: true,
    name: true,
    createdBy: true,
    color: true,
  }).safeParse(role);

  if (!validatedFields.success) throw new Error("Invalid role data");

  const { data: newRoleBase } = validatedFields;

  // 2. validate owner
  if (newRoleBase.createdBy !== currentUserId)
    throw new Error("Unauthorized role creation");

  // 3. Validate if the role is already existing - i.e. duplicate id
  const roleExists = structure.roles.some((r) => r.id === newRoleBase.id);

  if (roleExists) throw new Error("Role already exists");

  // 4. Sanitize the input role with no members, permissions, or linked teams
  const newRole: Role = {
    ...newRoleBase,
    members: [],
    linkedTeams: [],
    permissions: [],
  };

  // 5. Create the role
  const newStructure = produce(structure, (draft) => {
    draft.roles.push(newRole);
  });

  return newStructure;
}
