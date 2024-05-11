"use client";

import { SettingsContentHeader, SettingsContentSection } from "../settings";

import { InviteLink } from "./invite-sections";
import { useTable } from "../use-table";
import { membersColumns } from "./members-columns";
import { Mutable } from "@/lib/utils";
import { DrObj, Member } from "@repo/data";
import { SettingsSearchInput } from "../settings-search-input";
import { DataTable } from "@/components/data-table/data-table";
import { useCurrentWorkspace } from "@/components/workspace-provider";

export function MembersSettings() {
  const { members, workspaceRep, workspaceId } = useCurrentWorkspace();

  const { table } = useTable({
    data: (members?.members as Mutable<DrObj<Member>[]>) || [],
    columns: membersColumns({ changeMemberRole, removeMember, workspaceId }),
  });

  const nMembers = table.getFilteredRowModel().rows.length;

  async function removeMember(memberId: string) {
    await workspaceRep?.mutate.removeMember(memberId);
  }

  async function changeMemberRole(memberId: string, role: Member["role"]) {
    await workspaceRep?.mutate.changeMemberRole({ memberId, role });
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Members settings"
        description="Manage members in this workspace"
      />

      <SettingsContentSection header="Invite Link">
        <InviteLink />
      </SettingsContentSection>

      <SettingsContentSection header="Manage Members">
        <div className="space-y-4">
          <SettingsSearchInput
            table={table}
            searchColumn="member"
            placeHolder="Search by email, username, or name"
          />

          {nMembers > 0 && (
            <p className="text-xs">
              {nMembers > 1 ? `${nMembers} members` : `1 member`}
            </p>
          )}

          <DataTable table={table} placeholder="No members found" />
        </div>
      </SettingsContentSection>
    </div>
  );
}
