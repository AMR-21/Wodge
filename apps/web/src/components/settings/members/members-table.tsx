import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { DataTable } from "@repo/ui";
import { Mutable } from "@/lib/utils";
import { membersColumns } from "./members-columns";
import { useTable } from "../use-table";

export function MembersTable() {
  const { members, inviters } = useCurrentWorkspace();

  if (!inviters) return null;

  const { table } = useTable({
    data: members.members as Mutable<typeof members.members>,
    columns: membersColumns(inviters),
  });

  return (
    <div>
      <DataTable table={table} />
    </div>
  );
}
