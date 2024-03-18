import { produce } from "immer";
import { WorkspaceGroupMutation } from "./types";
import { Group, GroupSchema } from "../../../schemas/workspace.schema";

export interface GroupInfoUpdate extends WorkspaceGroupMutation {
  update: {
    name: Group["name"];
    color: Group["color"];
  };
}

export function updateGroupInfoMutation({
  structure,
  update,
  groupId,
}: GroupInfoUpdate) {
  // 1. Validate the update request
  const validatedFields = GroupSchema.pick({
    color: true,
    name: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid group update data");

  const {
    data: { name, color },
  } = validatedFields;

  // 2. Check if group already exists
  const groupIdx = structure.groups.findIndex((g) => g.id === groupId);

  if (groupIdx === -1) throw new Error("Group does not exist");

  // 3. Update the group
  const newStructure = produce(structure, (draft) => {
    const curGroup = draft.groups[groupIdx]!;
    if (name) curGroup.name = name;
    if (color) curGroup.color = color;
  });

  return newStructure;
}
