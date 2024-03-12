import { TeamSchema, makeWorkspaceStructureKey } from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

import { produce } from "immer";

export async function deleteTeam(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1
  // 2.Validate the data
  const validatedFields = TeamSchema.safeParse(mutation.args);
  //! throw error
  if (!validatedFields.success) {
    return;
  }

  const { data: theTeam } = validatedFields;

  //  !Bug: Should throw an error if the data is invalid
  if (theTeam.createdBy !== userId || !theTeam.members.includes(userId)) {
    return;
  }

  const structure = party.workspaceStructure;
  // 3. Validate if the team is already existing
  const teamExists = structure.data.teams.some((t) => t.id === theTeam.id);

  // !Bug: throw an error
  if (!teamExists) {
    return;
  }

  // 4. Delete the team
  const newStructure = produce(structure, (draft) => {
    draft.data.teams = draft.data.teams.filter(
      (team) => team.id !== theTeam.id
    );
    draft.lastModifiedVersion = nextVersion;
  });

  //5. presist the data
  await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);
}
