import { TeamSchema, makeWorkspaceStructureKey } from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

import { produce } from "immer";

export async function updateTeam(
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
  //3.update team 
  const newStructure = produce(structure.data, (draft) => {
    const index = draft.teams.findIndex((t) => t.id === newTeam.id);
    if (index != -1) {
      draft.teams[index] = newTeam;
    }
    else {
      return;
    }
  });
  //4. Persist the mutation
  await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);

}
