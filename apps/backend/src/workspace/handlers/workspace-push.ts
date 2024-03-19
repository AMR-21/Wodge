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
import { initWorkspace } from "./init-workspace";
import { deleteWorkspace } from "../mutators/delete-workspace";
import { produce } from "immer";
import { createTeamMutation } from "@repo/data/models/workspace/mutators/create-team";
import { createTeam } from "../mutators/create-team";
import { updateTeam } from "../mutators/update-team";
import { removeMember } from "../mutators/remove-member";
import { changeMemberRole } from "../mutators/change-member-role";
import { createGroup } from "../mutators/create-group";
import { updateGroup } from "../mutators/update-group";
import { deleteGroup } from "../mutators/delete-group";
import { deleteTeam } from "../mutators/delete-team";
import { updateWorkspace } from "../mutators/update-workspace";

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
        return initWorkspace(party, params);

      case "removeMember":
        return await removeMember(party, params);

      case "changeMemberRole":
        return await changeMemberRole(party, params);

      case "createTeam":
        return await createTeam(party, params);

      case "createGroup":
        return await createGroup(party, params);

      case "updateTeam":
        return await updateTeam(party, params);

      case "updateGroup":
        return await updateGroup(party, params);

      case "updateWorkspace":
        return await updateWorkspace(party, params);

      case "deleteGroup":
        return await deleteGroup(party, params);

      case "deleteTeam":
        return await deleteTeam(party, params);

      // case "DeleteWorkspace":
      //   return deleteWorkspace(party, params);
      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}
