import { Mutable } from "@/lib/utils";
import * as React from "react";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import {
  DrObj,
  Role,
  Team,
  WORKSPACE_ROLE_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "@repo/data";
import { nanoid } from "nanoid";
import { DataTable, useCurrentUser } from "@repo/ui";
import { UpdateHandlerProps, useTable } from "../use-table";
import { rolesColumns } from "./roles-columns";

export function RolesSettings() {
  const { structure, members, workspace } = useCurrentWorkspace();

  const columns = React.useMemo(
    () =>
      rolesColumns({
        members: members.members,
        deleteRole,
        teams: structure.teams,
      }),
    [members],
  );
  const user = useCurrentUser();
  const roles = React.useMemo(() => {
    return [
      {
        id: nanoid(WORKSPACE_ROLE_ID_LENGTH),
        name: "Admin",
        permissions: [],
        members: [],
        createdBy: user?.data.id || "",
        linkedTeams: [],
      },
    ] satisfies DrObj<Role>[];
  }, [structure, user]);

  const { table } = useTable<Mutable<DrObj<Role>>, DrObj<Role>>({
    data: roles,
    columns: columns,
    updateHandler: onUpdate,
    withForm: true,
  });

  async function deleteRole(roleId: string) {
    console.log("delete", roleId);
  }

  async function onUpdate({ data, idx }: UpdateHandlerProps<DrObj<Team>>) {
    console.log("onUpdate", data, idx);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Roles"
        description="Manage your workspace's roles"
      />

      <SettingsContentSection header="Roles">
        <DataTable table={table} label="role" withForm />
      </SettingsContentSection>
    </div>
  );
}
