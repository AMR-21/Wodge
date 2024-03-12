import { TeamSchema, makeWorkspaceStructureKey } from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

import { produce } from "immer";

export async function createTeam(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1. check if is allowed -> rbac

  // 2. validate the data
  const validatedFields = TeamSchema.safeParse(mutation.args);

  //  Bug: Should throw an error if the data is invalid
  if (!validatedFields.success) {
    return;
  }

  const { data: newTeam } = validatedFields;

  // 2. validate owner

  //  Bug: Should throw an error if the data is invalid
  if (newTeam.createdBy !== userId || !newTeam.members.includes(userId)) {
    return;
  }

  const structure = party.workspaceStructure;

  // 3. Validate if the team is already existing
  const teamExists = structure.data.teams.some((t) => t.id === newTeam.id);

  if (teamExists) {
    return;
  }

  // 4. Create the team
  const newStructure = produce(structure, (draft) => {
    draft.data.teams.push(newTeam);
    draft.lastModifiedVersion = nextVersion;
  });

  // 5. Persist the mutation
  await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);
}
