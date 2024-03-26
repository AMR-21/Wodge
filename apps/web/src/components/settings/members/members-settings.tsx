import { SettingsContentHeader, SettingsContentSection } from "../settings";

import { useInvites } from "./use-invites";
import { InviteLink } from "./invite-sections";
import { useTable } from "../use-table";
import { membersColumns } from "./members-columns";
import { Mutable } from "@/lib/utils";
import { DrObj, Member } from "@repo/data";
import { SettingsSearchInput } from "../settings-search-input";
import { DataTable } from "@repo/ui/components/data-table/data-table";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function MembersSettings() {
  const { invites, inviteLink, isPending } = useInvites();
  const { members, workspaceRep, workspaceId } = useCurrentWorkspace();

  const { table } = useTable({
    data: (members?.members as Mutable<DrObj<Member>[]>) || [],
    columns: membersColumns({ changeMemberRole, removeMember, workspaceId }),
  });

  async function removeMember(memberId: string) {
    await workspaceRep?.mutate.removeMember(memberId);
  }

  async function changeMemberRole(memberId: string, role: Member["role"]) {
    await workspaceRep?.mutate.changeMemberRole({ memberId, role });
  }

  // Todo render email invites
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
          <div className="flex justify-between">
            <SettingsSearchInput
              table={table}
              searchColumn="member"
              placeHolder="Search members by email"
            />

            {/* <MembersCombobox members={members?.members || []} /> */}
          </div>
          <DataTable table={table} />
        </div>
      </SettingsContentSection>
    </div>
  );
}
