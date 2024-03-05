import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { DataTable } from "@repo/ui";
import { Mutable } from "@/lib/utils";
import { membersColumns } from "./members-columns";

export function MembersTable() {
  const { members, inviters } = useCurrentWorkspace();

  if (!members || !inviters) return null;

  return (
    <div>
      <DataTable
        columns={membersColumns(inviters)}
        data={members.members as Mutable<typeof members.members>}
      />
    </div>
  );
}
