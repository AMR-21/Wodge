import { changeMemberRoleMutation } from "@repo/data/models/workspace/mutators/change-member-role";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { WorkspaceMembers, makeWorkspaceMembersKey } from "@repo/data";

export async function changeMemberRole(
  party: WorkspaceParty,
  params: RunnerParams
) {
  party.workspaceMembers.data = changeMemberRoleMutation({
    members: party.workspaceMembers.data,
    memberId: params.mutation.args.memberId,
    role: params.mutation.args.role,
  }) as WorkspaceMembers;

  party.workspaceMembers.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceMembersKey(),
    party.workspaceMembers
  );
}
