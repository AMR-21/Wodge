"use client";

import { MembersSettings } from "@/components/settings/members/members-settings";
import { GroupSettings } from "@/components/settings/groups/group-settings";
import { GroupsSidebar } from "@/components/settings/groups/groups-sidebar";
import {
  Settings,
  SettingsContent,
  SettingsSidebar,
  SettingsSidebarCollapsibleItem,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsSidebarList,
} from "@/components/settings/settings";
import { TeamSettings } from "@/components/settings/team/team-settings";
import { TeamsSidebar } from "@/components/settings/team/teams-sidebar";

import { WorkspaceSettings } from "@/components/settings/general/workspace-settings";
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
            <SettingsSidebarCollapsibleItem value="groups">
              <GroupsSidebar />
            </SettingsSidebarCollapsibleItem>
            <SettingsSidebarCollapsibleItem value="teams">
              <TeamsSidebar />
            </SettingsSidebarCollapsibleItem>
            <SettingsSidebarItem value="upgrade" />
          </SettingsSidebarList>
        </SettingsSidebar>

        <SettingsContent id="general">
          <WorkspaceSettings />
        </SettingsContent>

        <SettingsContent id="teams">
          <TeamSettings />
        </SettingsContent>

        <SettingsContent id="groups">
          <GroupSettings />
        </SettingsContent>
        <SettingsContent id="members">
          <MembersSettings />
        </SettingsContent>
        <SettingsContent id="upgrade">
          <p>upgrade</p>
        </SettingsContent>
      </Settings>
    </div>
  );
}

export default WorkspaceSettingsPage;