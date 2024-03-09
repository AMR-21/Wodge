import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { GeneralMembersTable } from "../general-members-table";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";
import { DrObj, Member, Role } from "@repo/data";
import { generalMembersColumns } from "../general-members-columns";

export function RoleMembersSettings({ role }: { role: DrObj<Role> }) {
  const { members } = useCurrentWorkspace();

  const { table } = useTable({
    data: members.members as Mutable<DrObj<Member>[]>,
    columns: generalMembersColumns({
      creatorId: role?.createdBy,
      removeMember,
    }),
  });

  function removeMember(memberId: string) {
    console.log("remove member", memberId);
  }

  function addMember(member: Member) {
    console.log("add member", member);
  }
  return (
    <GeneralMembersTable
      table={table}
      members={members.members}
      addMember={addMember}
    />
  );
}
