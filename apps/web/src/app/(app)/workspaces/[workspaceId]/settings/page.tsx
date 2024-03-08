"use client";

import { MembersSettings } from "@/components/settings/members/members-settings";
import { RolesSettings } from "@/components/settings/roles/role-settings";
import {
  Settings,
  SettingsClose,
  SettingsContent,
  SettingsSidebar,
  SettingsSidebarAccordionItem,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsSidebarList,
} from "@/components/settings/settings";
import { TeamSettings } from "@/components/settings/team/team-settings";
import { TeamsSidebar } from "@/components/settings/team/teams-sidebar";

import { WorkspaceSettings } from "@/components/settings/workspace-settings";
import { Building2 } from "lucide-react";

function WorkspaceSettingsPage() {
  return (
    <div className="flex h-full w-full">
      <Settings defaultActive="general">
        <SettingsSidebar>
          <SettingsSidebarHeader>
            <Building2 className="h-4 w-4" />
            <span>Workspace</span>
          </SettingsSidebarHeader>
          <SettingsSidebarList>
            <SettingsSidebarItem value="general" />
            <SettingsSidebarItem value="members" />
            <SettingsSidebarItem value="roles" />
            <SettingsSidebarAccordionItem value="teams">
              <TeamsSidebar />
            </SettingsSidebarAccordionItem>
            <SettingsSidebarItem value="upgrade" />
          </SettingsSidebarList>
        </SettingsSidebar>

        <SettingsContent id="general">
          <WorkspaceSettings />
        </SettingsContent>

        <SettingsContent id="teams">
          {/* <TeamsSettings /> */}
          <TeamSettings />
        </SettingsContent>

        <SettingsContent id="roles">
          <RolesSettings />
        </SettingsContent>
        <SettingsContent id="members">
          <MembersSettings />
        </SettingsContent>
        <SettingsContent id="upgrade">
          <p>updgrade</p>
        </SettingsContent>

        <SettingsContent id="add-teams">
          <p>add</p>
        </SettingsContent>
        {/* <SettingsClose /> */}
      </Settings>
    </div>
  );
}

export default WorkspaceSettingsPage;
