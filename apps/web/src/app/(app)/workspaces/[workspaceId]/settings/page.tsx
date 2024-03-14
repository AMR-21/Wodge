"use client";

import { MembersSettings } from "@/components/settings/members/members-settings";
import { RoleSettings } from "@/components/settings/roles/role-settings";
import { RolesSidebar } from "@/components/settings/roles/roles-sidebar";
import {
  Settings,
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
            <SettingsSidebarAccordionItem value="roles">
              <RolesSidebar />
            </SettingsSidebarAccordionItem>
            {/* <SettingsSidebarItem value="roles" /> */}
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
          <TeamSettings />
        </SettingsContent>

        <SettingsContent id="roles">
          <RoleSettings />
        </SettingsContent>
        <SettingsContent id="members">
          <MembersSettings />
        </SettingsContent>
        <SettingsContent id="upgrade">
          <p>updgrade</p>
        </SettingsContent>

        {/* <SettingsClose /> */}
      </Settings>
    </div>
  );
}

export default WorkspaceSettingsPage;
