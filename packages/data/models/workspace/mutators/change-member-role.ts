import { produce } from "immer";
import { DrObj } from "../../..";
import {
  Member,
  MemberSchema,
  WorkspaceMembers,
} from "../../../schemas/workspace.schema";

interface ChangeMemberRoleMutationArgs {
  memberId: string;
  role: Member["role"];
  members: WorkspaceMembers | DrObj<WorkspaceMembers>;
}

export function changeMemberRoleMutation({
  members,
  memberId,
  role,
}: ChangeMemberRoleMutationArgs) {
  const validatedFields = MemberSchema.pick({
    role: true,
  }).safeParse({ role });

  if (!validatedFields.success) throw new Error("Invalid role");

  const {
    data: { role: newRole },
  } = validatedFields;

  const mIdx = members.members.findIndex((m) => m.id === memberId);

  if (mIdx === -1) {
    throw new Error("Member not found");
  }

  const member = members.members[mIdx]!;

  if (member.role === "owner") {
    throw new Error("Cannot change owner role");
  }

  return produce(members, (draft) => {
    const member = draft.members[mIdx]!;
    member.role = newRole;
  });
}
