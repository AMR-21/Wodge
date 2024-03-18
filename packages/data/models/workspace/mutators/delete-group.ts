import { produce } from "immer";
import { WorkspaceGroupMutation } from "./types";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

export function deleteGroupMutation({
  structure,
  groupId,
}: WorkspaceGroupMutation) {
  // 1. check if the group not existing
  const groupExists = structure.groups.some((g) => g.id === groupId);

  if (!groupExists) throw new Error("Group not found");

  // 2. Delete the group
  const newStructure = produce(structure, (draft) => {
    draft.groups = draft.groups.filter((g) => g.id !== groupId);
  });

  return newStructure as WorkspaceStructure;
}
