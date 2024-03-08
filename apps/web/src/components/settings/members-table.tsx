import { DrObj, Member } from "@repo/data";
import { DataTable, Input } from "@repo/ui";
import { membersColumns } from "./members-columns";
import { useTable } from "./use-table";
import { Mutable } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { MembersCombobox } from "./members-combobox";

interface MembersTableProps<TData> {
  table: Table<TData>;
  members: readonly DrObj<Member>[];
  addMember: (member: DrObj<Member>) => void;
}

export function MembersTable<TData>({
  table,
  members,
  addMember,
}: MembersTableProps<TData>) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search members by emails "
          className="max-w-56"
          value={(table.getColumn("member")?.getFilterValue() as string) ?? ""}
          onChange={(e) => {
            table.getColumn("member")?.setFilterValue(e.target.value);
          }}
        />
        <MembersCombobox members={members} onClick={addMember} />
      </div>

      <DataTable table={table} />
    </div>
  );
}
