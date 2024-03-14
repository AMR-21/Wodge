import { SettingsContentHeader, SettingsContentSection } from "../settings";

import { useInvites } from "./use-invites";
import { InviteLink } from "./invite-sections";
import { useTable } from "../use-table";
import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { membersColumns } from "./members-columns";
import { Mutable } from "@/lib/utils";
import { DrObj, Member } from "@repo/data";
import { SettingsSearchInput } from "../settings-search-input";
import { MembersCombobox } from "../members-combobox";
import { DataTable } from "@repo/ui/components/data-table/data-table";

export function MembersSettings() {
  const { invites, inviteLink, isPending } = useInvites();
  const { members, inviters } = useCurrentWorkspace();

  const { table } = useTable({
    data: members.members as Mutable<DrObj<Member>[]>,
    columns: membersColumns({ inviters, removeMember }),
  });

  function removeMember(memberId: string) {
    console.log("remove member", memberId);
  }
  // Todo render email invites
  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Members settings"
        description="Manage members in this workspace"
      />

      <SettingsContentSection header="Invite Link">
        <InviteLink inviteLink={inviteLink} isPending={isPending} />
      </SettingsContentSection>

      <SettingsContentSection header="Manage Members">
        <div className="space-y-4">
          <div className="flex justify-between">
            <SettingsSearchInput
              table={table}
              searchColumn="member"
              placeHolder="Search members by email"
            />

            <MembersCombobox
              members={members.members}
              onClick={(d) => console.log({ d })}
            />
          </div>
          <DataTable table={table} />
        </div>
      </SettingsContentSection>
    </div>
  );
}
