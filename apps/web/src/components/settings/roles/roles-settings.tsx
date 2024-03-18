import { Mutable } from "@/lib/utils";
import * as React from "react";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import {
  DrObj,
  Role,
  Team,
  WORKSPACE_ROLE_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "@repo/data";
import { nanoid } from "nanoid";

import { UpdateHandlerProps, useTable } from "../use-table";
import { rolesColumns } from "./roles-columns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

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
        createdBy: user?.id || "",
        linkedTeams: [],
        color: "#123131",
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
      <SettingsContentHeader label="Roles settings" />
      <Tabs>
        <TabsList className="w-full">
          <TabsTrigger className="grow" value="g">
            General
          </TabsTrigger>
          <TabsTrigger className="grow" value="i">
            Permissions
          </TabsTrigger>
          <TabsTrigger className="grow" value="h">
            Linked Teams
          </TabsTrigger>
          <TabsTrigger className="grow" value="k">
            Members
          </TabsTrigger>
        </TabsList>
        <div className="bg-red-500">
          <TabsContent value="h">hi</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
