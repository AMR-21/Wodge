import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { initWorkspace } from "./init-workspace";
import { createTeam } from "../mutators/create-team";
import { updateTeam } from "../mutators/update-team";
import { removeMember } from "../mutators/remove-member";
import { changeMemberRole } from "../mutators/change-member-role";
import { createGroup } from "../mutators/create-group";
import { updateGroup } from "../mutators/update-group";
import { deleteGroup } from "../mutators/delete-group";
import { deleteTeam } from "../mutators/delete-team";
import { updateWorkspace } from "../mutators/update-workspace";
import { createPage } from "../mutators/create-page";
import { createRoom } from "../mutators/create-room";
import { createThread } from "../mutators/create-thread";
import { toggleThread } from "../mutators/toggle-thread";
import { isAdmin, isOwner, isTeamMember, isTeamModerator } from "@repo/data";

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
    const isOwnerOrAdmin =
      isAdmin({
        members: party.workspaceMembers.data,
        userId: req.headers.get("x-user-id")!,
      }) ||
      isOwner({
        members: party.workspaceMembers.data,
        userId: req.headers.get("x-user-id")!,
      });

    const isTeamModeratorFlag = isTeamModerator({
      structure: party.workspaceStructure.data,
      userId: req.headers.get("x-user-id")!,
      teamId: params.mutation.args.teamId,
    });

    switch (params.mutation.name) {
      case "removeMember":
        if (!isOwnerOrAdmin) return;
        return await removeMember(party, params);

      case "changeMemberRole":
        return await changeMemberRole(party, params);

      case "createTeam":
        if (!isOwnerOrAdmin) return;

        return await createTeam(party, params);

      case "createGroup":
        if (!isOwnerOrAdmin) return;

        return await createGroup(party, params);

      case "updateTeam":
        if (!isOwnerOrAdmin && !isTeamModeratorFlag) return;
        return await updateTeam(party, params);

      case "updateGroup":
        if (!isOwnerOrAdmin) return;

        return await updateGroup(party, params);

      case "updateWorkspace":
        if (!isOwnerOrAdmin) return;

        return await updateWorkspace(party, params);

      case "deleteGroup":
        if (!isOwnerOrAdmin) return;

        return await deleteGroup(party, params);

      case "deleteTeam":
        if (!isOwnerOrAdmin) return;

        return await deleteTeam(party, params);

      case "createPage":
        if (!isOwnerOrAdmin && !isTeamModeratorFlag) return;
        return await createPage(party, params);

      case "createRoom":
        if (!isOwnerOrAdmin && !isTeamModeratorFlag) return;

        return await createRoom(party, params);

      case "createThread":
        if (!isOwnerOrAdmin && !isTeamModeratorFlag) return;

        return await createThread(party, params);

      case "toggleThread":
        return await toggleThread(
          party,
          params,
          isOwnerOrAdmin || isTeamModeratorFlag
        );

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}
