import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import {
  WorkspaceMembers,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { produce } from "immer";
import { PushAuth } from "../handlers/workspace-push";

export async function removeMember(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin) return;

  const memberId = params.mutation.args as string;

  // Update the user party
  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(memberId);

  const res = await userInstance.fetch("/service/remove-workspace", {
    method: "POST",
    headers: {
      authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({ workspaceId: party.room.id }),
  });

  if (!res.ok) throw new Error("Failed to remove member");

  const newState = removeMemberMutation({
    memberId,
    members: party.workspaceMembers.data,
  }) as WorkspaceMembers;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data = newState;
    draft.lastModifiedVersion = params.nextVersion;
  });

  // remove the member from every group and every team
  party.workspaceStructure = produce(party.workspaceStructure, (draft) => {
    draft.data.teams.forEach((t) => {
      if (t.members.includes(memberId))
        t.members = t.members.filter((tt) => tt !== memberId);
    });

    draft.data.groups.forEach((g) => {
      if (g.members.includes(memberId))
        g.members = g.members.filter((gg) => gg !== memberId);
    });

    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [makeWorkspaceStructureKey()]: party.workspaceStructure,
  });

  await party.poke({
    type: "workspaceMembers",
    id: party.room.id,
  });
}
