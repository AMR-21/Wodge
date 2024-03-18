import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { WorkspaceMembers, makeWorkspaceMembersKey } from "@repo/data";
import { produce } from "immer";

export async function removeMember(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const memberId = params.mutation.args as string;

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

  // Update the user party
  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(memberId);

  await userInstance.fetch("/remove-workspace", {
    method: "POST",
    headers: {
      authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({ workspaceId: party.room.id }),
  });
}
