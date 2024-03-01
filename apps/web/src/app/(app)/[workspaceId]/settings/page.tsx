"use client";

import { MembersSettings } from "@/components/settings/members/members-settings";
import {
  Settings,
  SettingsClose,
  SettingsContent,
  SettingsSidebar,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsSidebarList,
} from "@/components/settings/settings";
import { TeamsSettings } from "@/components/settings/teams/teams-settings";
import { WorkspaceSettings } from "@/components/settings/workspace-settings";
import { Building2 } from "lucide-react";

function WorkspaceSettingsPage() {
  return (
    <div className="flex h-full w-full">
      <Settings defaultActive="members">
        <SettingsSidebar>
          <SettingsSidebarHeader>
            <Building2 className="h-4 w-4" />
            <span>Workspace</span>
          </SettingsSidebarHeader>
          <SettingsSidebarList>
            <SettingsSidebarItem value="general" />
            <SettingsSidebarItem value="members" />
            <SettingsSidebarItem value="teams" />
            <SettingsSidebarItem value="roles" />
            <SettingsSidebarItem value="upgrade" />
          </SettingsSidebarList>
        </SettingsSidebar>

        <SettingsContent id="general">
          <WorkspaceSettings />
        </SettingsContent>

        <SettingsContent id="teams">
          <TeamsSettings />
        </SettingsContent>

        <SettingsContent id="roles">roles</SettingsContent>
        <SettingsContent id="members">
          <MembersSettings />
        </SettingsContent>
        <SettingsContent id="upgrade">upgrade</SettingsContent>

        <SettingsClose />
      </Settings>
    </div>
  );
}

export default WorkspaceSettingsPage;
