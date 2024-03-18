import { produce } from "immer";
import { DrObj, Group, GroupSchema, WorkspaceStructure } from "../../..";

interface CreateRoleArgs {
  // Any to account for the backend mutation runner - relay on zod to validate the data
  group: Omit<Group, "members" | "createdBy">;
  currentUserId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createGroupMutation({
  group,
  structure,
  currentUserId,
}: CreateRoleArgs) {
  // 1. Validate the data
  const validatedFields = GroupSchema.pick({
    id: true,
    name: true,
    color: true,
  }).safeParse(group);

  if (!validatedFields.success) throw new Error("Invalid role data");

  const { data: newGroupBase } = validatedFields;

  // 2. Validate if the group is already existing - i.e. duplicate id
  const groupExists = structure.groups.some((g) => g.id === newGroupBase.id);

  if (groupExists) throw new Error("Group already exists");

  // 4. Sanitize the input group with no members, permissions, or linked teams
  const newGroup: Group = {
    ...newGroupBase,
    createdBy: currentUserId,
    members: [],
  };

  // 5. Create the role
  const newStructure = produce(structure, (draft) => {
    draft.groups.push(newGroup);
  });

  return newStructure;
}
