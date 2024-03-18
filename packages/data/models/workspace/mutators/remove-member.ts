import { produce } from "immer";
import { WorkspaceMembers } from "../../../schemas/workspace.schema";
import { DrObj } from "../../..";

interface RemoveMemberArgs {
  memberId: string;
  members: WorkspaceMembers | DrObj<WorkspaceMembers>;
}

export function removeMemberMutation({ memberId, members }: RemoveMemberArgs) {
  if (memberId === members.owner) throw new Error("Cannot remove owner");

  const newMembers = produce(members, (draft) => {
    draft.members = draft.members.filter((m) => m.id !== memberId);
  });

  return newMembers;
}
