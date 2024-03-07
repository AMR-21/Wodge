import { DrObj, Member, Team } from "@repo/data";
import { Button, DataTable, Input } from "@repo/ui";
import { DeepReadonlyObject } from "replicache";
import { teamMembersColumns } from "./teams-members-columns";
import { Mutable } from "@/lib/utils";
import { SettingsContentSection } from "../settings";
import { MembersCombobox } from "./members-combobox";
import {
  ColumnFiltersState,
  Table,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { getFilteredRowModel } from "@tanstack/react-table";
import { useTable } from "../use-table";
interface TeamMembersDialogProps {
  members: readonly DrObj<Member>[];
  teamId: string;
  moderators: readonly string[];
  addMember: (member: DrObj<Member>) => void;
  // removeMember: (memberId: string) => void;
  // makeModerator: (memberId: string) => void;
  table: Table<DeepReadonlyObject<Team>>;
}

export function TeamMembersDialog({
  addMember,
  // makeModerator,
  // removeMember,
  members,
  moderators,
  teamId,
  // table,
}: TeamMembersDialogProps) {
  // TODO
  // const teamMembers = members.filter((member) => member.teams.includes(teamId));
  // + non team members
  const teamMembers = members;

  const { table } = useTable({
    data: teamMembers as Mutable<DrObj<Member>[]>,
    columns: teamMembersColumns(moderators),
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

          <MembersCombobox members={members} onClick={addMember} />
        </div>
        <DataTable table={table} />
      </SettingsContentSection>
    </div>
  );
}
