import { RoleSchema, makeWorkspaceStructureKey } from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { produce } from "immer";
import lodash from "lodash";

export async function updateRole(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1. Validate the data
  const validatedFields = RoleSchema.safeParse(mutation.args);

  if (!validatedFields.success) {
    return;
  }

  const { data: newRole } = validatedFields;

  //  Bug: Should throw an error if the data is invalid
  if (newRole.createdBy !== userId || !newRole.members.includes(userId)) {
    return;
  }

  // check if the role exists once with lodash
  const membersNoDuplicates = lodash.uniq(newRole.members);
  // replace the members with the new array
  newRole.members = membersNoDuplicates;

  const structure = party.workspaceStructure;

  // 3. Validate if the role is already existing
  const roleExists = structure.data.roles.some((t) => t.id === newRole.id);

  if (!roleExists) {
    return;
  }

  // 4. update the role
  const newStructure = produce(structure, (draft) => {
    const index = draft.data.roles.findIndex((r) => r.id === newRole.id);

    if (index !== -1) {
      draft.data.roles[index] = newRole;
      draft.lastModifiedVersion = nextVersion;
    }
  });

  // 5. Persist the mutation

  await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);
}
