import { DrObj, Member } from "@repo/data";
import { useTable } from "./use-table";
import { Mutable } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { MembersCombobox } from "./members-combobox";
import { Input } from "@repo/ui/components/ui/input";
import { DataTable } from "@repo/ui/components/data-table/data-table";

interface MembersTableProps<TData> {
  table: Table<TData>;
  members: readonly DrObj<Member>[];
  addMember?: (member: DrObj<Member>) => void;
}

export function GeneralMembersTable<TData>({
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
        {addMember && <MembersCombobox members={members} onClick={addMember} />}
      </div>

      <DataTable table={table} />
    </div>
  );
}
