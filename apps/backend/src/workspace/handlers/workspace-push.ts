import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { badRequest, unauthorized } from "../../lib/http-utils";
import {
  PublicUserType,
  Team,
  // WorkspaceTeamMutation,
  WorkspaceSchema,
  defaultWorkspaceStructure,
  makeWorkspaceStructureKey,
  // updateTeamMutator,
} from "@repo/data";
import { makeWorkspaceKey } from "@repo/data";
import { isAllowed } from "../../lib/utils";
import { initWorkspace } from "../mutators/init-workspace";
import { deleteWorkspace } from "../mutators/delete-workspace";
import { produce } from "immer";
import { createTeam } from "@repo/data/models/workspace/mutators/create-team";

export async function workspacePush(req: Party.Request, party: WorkspaceParty) {
  const res = await repPush({
    req,
    storage: party.room.storage,
    versions: party.versions,
    runner: runner(party, req),
  });

  if (res.status === 200) {
    await party.poke();
  }

  return res;
}

//verify room id
function runner(party: WorkspaceParty, req: Party.Request) {
  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "initWorkspace":
        const userData = JSON.parse(
          req.headers.get("x-user-data")!
        ) as PublicUserType;

        return initWorkspace(party, params, userData);

      case "createTeam":
        const str = await party.room.storage.get(makeWorkspaceStructureKey());
        console.log({ str });
        party.workspaceStructure.data = createTeam({
          currentUserId: params.userId,
          structure: str.data,
          team: params.mutation.args as Team,
        });

        party.workspaceStructure.lastModifiedVersion = params.nextVersion;

        await party.room.storage.put(
          makeWorkspaceStructureKey(),
          party.workspaceStructure
        );

        return;

      // case "updateTeam":

      case "DeleteWorkspace":
        return deleteWorkspace(party, params);
      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}
