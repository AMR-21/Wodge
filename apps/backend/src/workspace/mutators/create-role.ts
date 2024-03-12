import {
  RoleSchema,
  TeamSchema,
  WorkspaceStructure,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

import { produce } from "immer";

export async function createRole(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  const validatedFields = RoleSchema.safeParse(mutation.args);
  //  Bug: Should throw an error if the data is invalid
  if (!validatedFields.success) {
    return;
  }
  const { data: newRole } = validatedFields;
  //2. Validate if the role is already existing
  const roleExists = party.workspaceStructure.data.roles.some(
    (r) => r.id === newRole.id
  );
  if (roleExists) {
    return;
  }
  //3. Create the role
  const structure = party.workspaceStructure;
  const newStructure = produce(structure, (draft) => {
    if (draft.data.roles) {
      draft.data.roles.push(newRole);
    } else {
      draft.data.roles = [newRole];
    }
    draft.lastModifiedVersion = nextVersion;
  });

  //4. Persist the mutation
  await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);
}
