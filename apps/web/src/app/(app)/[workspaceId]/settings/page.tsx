"use client";

import {
  Settings,
  SettingsClose,
  SettingsContent,
  SettingsSidebar,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsSidebarList,
} from "@/components/settings/settings";
import { WorkspaceGeneralForm } from "@/components/settings/workspace-general-form";
import { Building2 } from "lucide-react";

function WorkspaceSettingsPage() {
  return (
    <div className="flex h-full">
      <Settings defaultActive="general">
        <SettingsSidebar>
          <SettingsSidebarHeader>
            <Building2 className="h-4 w-4" />
            <span>Workspace</span>
          </SettingsSidebarHeader>
          <SettingsSidebarList>
            <SettingsSidebarItem value="general" />
            <SettingsSidebarItem value="teams" />
            <SettingsSidebarItem value="roles" />
            <SettingsSidebarItem value="members" />
            <SettingsSidebarItem value="upgrade" />
          </SettingsSidebarList>
        </SettingsSidebar>

        <SettingsContent id="general">
          <WorkspaceGeneralForm />
        </SettingsContent>
        <SettingsContent id="teams">teams</SettingsContent>
        <SettingsContent id="roles">roles</SettingsContent>
        <SettingsContent id="members">members</SettingsContent>
        <SettingsContent id="upgrade">upgrade</SettingsContent>

        <SettingsClose />
      </Settings>
    </div>
  );
}

export default WorkspaceSettingsPage;
