import * as React from "react";
import {
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContext,
} from "../settings";
import {
  BRAND_COLOR,
  DrObj,
  Member,
  Role,
  WORKSPACE_ROLE_ID_LENGTH,
} from "@repo/data";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useCurrentUser,
} from "@repo/ui";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";
import { generalMembersColumns } from "../general-members-columns";
import { nanoid } from "nanoid";
import { RoleMembersSettings } from "./role-members-settings";
import { RoleGeneralForm } from "./role-general-form";
import { RolePermissions } from "./role-permissions";
import { LinkedTeams } from "./linked-teams";

export function RoleSettings() {
  const { activeItemId } = React.useContext(SettingsContext);
  const isAddition = activeItemId.startsWith("add-");

  const { structure } = useCurrentWorkspace();
  const user = useCurrentUser();
  const roles = React.useMemo(() => {
    return [
      {
        id: "nanoid(WORKSPACE_ROLE_ID_LENGTH)",
        name: "Admin",
        permissions: [],
        members: [],
        linkedTeams: [],
        createdBy: user?.data.id || "",
        color: BRAND_COLOR,
      },
      {
        id: "add-roles",
        name: "",
        permissions: [],
        members: [],
        createdBy: user?.data.id || "",
        linkedTeams: [],
        color: BRAND_COLOR,
      },
    ] satisfies DrObj<Role>[];
  }, [structure, user]);

  const role = roles.find((role) => role.id === activeItemId);

  // Todo filter members by team
  const { members } = useCurrentWorkspace();

  if (!role) return null;

  function addMember(member: Member) {
    console.log("add member", member);
  }

  function removeMember(memberId: string) {
    console.log("remove member", memberId);
  }

  function changePermissions(permission: string, add: boolean) {}

  function linkTeam(teamId: string) {}
  function unLinkTeam(teamId: string) {}

  return (
    <div className="w-full shrink-0 grow ">
      <SettingsContentHeader
        label={`${isAddition ? "Add a new role" : role.name + " settings"}`}
        description={`${isAddition ? "Create a new role" : "Manage role settings"}`}
      />

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger className="grow" value="general">
            General
          </TabsTrigger>
          <TabsTrigger
            disabled={isAddition}
            className="grow"
            value="permissions"
          >
            Permissions
          </TabsTrigger>
          <TabsTrigger
            disabled={isAddition}
            className="grow"
            value="linked-teams"
          >
            Linked Teams
          </TabsTrigger>
          <TabsTrigger disabled={isAddition} className="grow" value="members">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SettingsContentSection>
            <RoleGeneralForm role={role} />
          </SettingsContentSection>
        </TabsContent>

        <TabsContent value="permissions">
          <SettingsContentSection>
            <RolePermissions
              permissions={role.permissions}
              changePermissions={changePermissions}
            />
          </SettingsContentSection>
        </TabsContent>

        <TabsContent value="linked-teams">
          <SettingsContentSection>
            <LinkedTeams
              linkTeam={linkTeam}
              linkedTeams={role.linkedTeams}
              unLinkTeam={unLinkTeam}
            />
          </SettingsContentSection>
        </TabsContent>

        <TabsContent value="members">
          <SettingsContentSection>
            <RoleMembersSettings role={role} />
          </SettingsContentSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
