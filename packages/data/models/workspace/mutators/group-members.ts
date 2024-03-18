import { produce } from "immer";
import { WorkspaceGroupMutation } from "./types";
import { Group, GroupSchema } from "../../../schemas/workspace.schema";

interface UpdateGroupArgs extends WorkspaceGroupMutation {
  update: {
    members: Group["members"];
  };
}

export function addGroupMembersMutation({
  update,
  structure,
  groupId,
  curMembers,
}: UpdateGroupArgs & { curMembers: string[] }) {
  // 1. Validate the update request
  const validatedFields = GroupSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid Group update data");

  // 2. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 2. Check if the added members exist in the current workspace
  const invalidMembers = members.filter((m) => !curMembers.includes(m));

  if (invalidMembers.length > 0) throw new Error("Invalid members");

  // 3. Check if Group already exists
  const groupIdx = structure.groups.findIndex((g) => g.id === groupId);

  if (groupIdx === -1) throw new Error("Group does not exist");

  // 4. Update the Group
  const newStructure = produce(structure, (draft) => {
    const curGroup = draft.groups[groupIdx]!;

    // Account for duplicate updates - in case of conflicts
    curGroup.members = Array.from(new Set([...curGroup.members, ...members]));
  });

  return newStructure;
}

export function removeGroupMembersMutation({
  update,
  structure,
  groupId,
}: UpdateGroupArgs) {
  // 1. Validate the update request
  const validatedFields = GroupSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid Group update data");

  // 1. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 2. Check if Group already exists
  const groupIdx = structure.groups.findIndex((g) => g.id === groupId);

  if (groupIdx === -1) throw new Error("Group does not exist");

  // 3. Update the team
  const newStructure = produce(structure, (draft) => {
    const curGroup = draft.groups[groupIdx]!;

    curGroup.members = curGroup.members.filter((m) => !members.includes(m));
  });

  return newStructure;
}
