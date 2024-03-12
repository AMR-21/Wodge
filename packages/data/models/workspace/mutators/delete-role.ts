import { produce } from "immer";
import { WorkspaceRoleMutation } from "./types";

export function deleteRoleMutation({
  structure,
  roleId,
}: WorkspaceRoleMutation) {
  // 1. check if the team not existing
  const rolesExists = structure.roles.some((t) => t.id === roleId);

  if (!rolesExists) throw new Error("Role not found");

  // 2. Delete the team
  const newStructure = produce(structure, (draft) => {
    draft.roles = draft.roles.filter((t) => t.id !== roleId);
  });

  return newStructure;
}
