import { DrObj, Member, Team } from "@repo/data";
import { DeepReadonlyObject } from "replicache";
import { teamMembersColumns } from "./teams-members-columns";
import { Mutable } from "@/lib/utils";
import { SettingsContentSection } from "../settings";
import { MembersCombobox } from "../members-combobox";
import { Table } from "@tanstack/react-table";
import * as React from "react";
import { useTable } from "../use-table";
import { Input } from "@repo/ui/components/ui/input";
import { DataTable } from "@repo/ui/components/data-table/data-table";
interface TeamMembersDialogProps {
  members: readonly DrObj<Member>[];
  creatorId: string;
  addMember: (member: DrObj<Member>) => void;
  removeMember: (memberId: string) => void;
  curMembersIds: readonly string[];
}

export function TeamMembersDialog({
  addMember,
  removeMember,
  members,
  curMembersIds,
  creatorId,
}: TeamMembersDialogProps) {
  // TODO

  const nonTeamMembers = React.useMemo(
    () => members.filter((m) => !curMembersIds.includes(m.id)),
    [curMembersIds, members],
  );

  const teamMembers = React.useMemo(
    () => members.filter((m) => curMembersIds.includes(m.id)),
    [curMembersIds, members],
  );

  const { table } = useTable({
    data: teamMembers as Mutable<DrObj<Member>[]>,
    columns: teamMembersColumns(removeMember, creatorId),
  });

  return (
    <div className="w-full">
      <SettingsContentSection
        header="Manage team members"
        className="space-y-4"
      >
        <div className="flex items-center justify-between  gap-4">
          <Input
            placeholder="Search members by emails "
            className="max-w-56"
            value={
              (table.getColumn("member")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) => {
              table.getColumn("member")?.setFilterValue(e.target.value);
            }}
          />

          <MembersCombobox members={nonTeamMembers} onClick={addMember} />
        </div>
        <DataTable table={table} />
      </SettingsContentSection>
    </div>
  );
}
