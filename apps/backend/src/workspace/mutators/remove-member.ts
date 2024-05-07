import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { WorkspaceMembers, makeWorkspaceMembersKey } from "@repo/data";
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

  const [res1, res2] = await Promise.all([
    userInstance.fetch("/remove-workspace", {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id }),
    }),
    fetch(`${party.room.env.AUTH_DOMAIN}/api/remove-member`, {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id, memberId }),
    }),
  ]);

  if (!res1.ok || !res2.ok) throw new Error("Failed to remove member");

  const newState = removeMemberMutation({
    memberId,
    members: party.workspaceMembers.data,
  }) as WorkspaceMembers;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data = newState;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put(
    makeWorkspaceMembersKey(),
    party.workspaceMembers
  );

  await party.poke({
    type: "workspaceMembers",
    id: party.room.id,
  });
}
