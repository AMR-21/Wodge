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
        createdBy: user?.data.id || "",
        linkedTeams: [],
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
          <TabsTrigger disabled={isAddition} className="grow" value="i">
            Permissions
          </TabsTrigger>
          <TabsTrigger disabled={isAddition} className="grow" value="h">
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
        <TabsContent value="members">
          <SettingsContentSection>
            <RoleMembersSettings role={role} />
          </SettingsContentSection>
        </TabsContent>
      </Tabs>
      {/* <SettingsContentSection header="General">
        <TeamGeneralForm team={team} />
      </SettingsContentSection> */}

      {/* {!isAddition && (
        <>
          <SettingsContentSection header="Manage Members">
            <GeneralMembersTable
              table={table}
              members={members.members}
              addMember={addMember}
            />
          </SettingsContentSection>

          <SettingsContentSection header="Manage Tags">
            <p>To do</p>
          </SettingsContentSection>

          <SettingsContentSection header="Danger Zone">
            <Button size="sm" variant="destructive">
              Delete Workspace
            </Button>
          </SettingsContentSection>
        </>
      )} */}
    </div>
  );
}
