import { useCurrentWorkspace } from "@/components/workspace/workspace-provider";
import { DataTable } from "@repo/ui";
import { columns } from "./members-columns";
import { Mutable } from "@/lib/utils";
import { DeepReadonly } from "replicache";

export function MembersTable() {
  const { members } = useCurrentWorkspace();

  if (!members) return null;

  console.log(members);
  return (
    <div>
      <DataTable
        columns={columns}
        data={members.members as Mutable<typeof members.members>}
      />
    </div>
  );
}
