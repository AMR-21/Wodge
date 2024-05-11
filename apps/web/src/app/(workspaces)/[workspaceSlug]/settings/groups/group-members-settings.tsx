import { GeneralMembersTable } from "../general-members-table";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";
import { DrObj, Group, Member } from "@repo/data";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useMembersInfo } from "@/hooks/use-members-info";
import { useMemo } from "react";
import { groupMembersColumns } from "./group-members-columns";

export function GroupMembersSettings({ group }: { group?: DrObj<Group> }) {
  const { members, structure, workspaceRep, workspaceId } =
    useCurrentWorkspace();

  const nonGroupMembers = useMemo(() => {
    return members.members.filter(
      (member) => !group?.members.includes(member.id),
    );
  }, [members, structure]);

  const { table } = useTable({
    data: (group?.members || []) as string[],
    columns: groupMembersColumns({
      creatorId: group?.createdBy,
      removeMember,
      workspaceId,
    }),
  });

  async function removeMember(memberId: string) {
    if (!group) return;
    await workspaceRep?.mutate.updateGroup({
      groupId: group.id,
      groupUpdate: {
        action: "removeMembers",
        update: {
          members: [memberId],
        },
      },
    });
  }

  async function addMember(memberId: string) {
    if (!group) return;

    await workspaceRep?.mutate.updateGroup({
      groupId: group.id,
      groupUpdate: {
        action: "addMembers",
        update: {
          members: [memberId],
        },
      },
    });
  }

  return (
    <GeneralMembersTable
      table={table}
      members={nonGroupMembers}
      addMember={addMember}
    />
  );
}
