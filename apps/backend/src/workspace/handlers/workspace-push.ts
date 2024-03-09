import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { badRequest, unauthorized } from "../../lib/http-utils";
import {
  TeamUpdate,
  WorkspaceSchema,
  defaultWorkspaceStructure,
  makeWorkspaceStructureKey,
  updateTeamMutator,
} from "@repo/data";
import { makeWorkspaceKey } from "@repo/data";
import { isAllowed } from "../../lib/utils";
import { initWorkspace } from "../mutators/init-workspace";
import { createTeam } from "../mutators/create-team";
import { deleteWorkspace } from "../mutators/delete-workspace";
import { produce } from "immer";

export async function workspacePush(req: Party.Request, party: WorkspaceParty) {
  const res = await repPush({
    req,
    storage: party.room.storage,
    versions: party.versions,
    runner: runner(party),
  });

  if (res.status === 200) {
    await party.poke();
  }

  return res;
}

//verify room id
function runner(party: WorkspaceParty) {
  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "initWorkspace":
        return initWorkspace(party, params);
      case "createTeam":
        return createTeam(party, params);
      case "updateTeam":
        const newStructure = updateTeamMutator(
          params.mutation.args as TeamUpdate,
          party.workspaceStructure.data
        );

        party.workspaceStructure = produce(
          party.workspaceStructure,
          (draft) => {
            draft.data = newStructure;
            draft.lastModifiedVersion = params.nextVersion;
          }
        );

        await party.room.storage.put(makeWorkspaceStructureKey(), newStructure);

        return;

      case "DeleteWorkspace":
        return deleteWorkspace(party, params);
      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}
