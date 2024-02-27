"use client";

import { Settings } from "@/components/settings/settings-sidebar";
import { Building2 } from "lucide-react";

function WorkspaceSettingsPage() {
  return (
    <Settings defaultActive="general">
      <Settings.Sidebar>
        <Settings.SidebarHeader>
          <Building2 className="h-4 w-4" />
          <span>Workspace Settings</span>
        </Settings.SidebarHeader>
        <Settings.SidebarList>
          <Settings.SidebarItem value="general" />
          <Settings.SidebarItem value="teams" />
          <Settings.SidebarItem value="roles" />
          <Settings.SidebarItem value="members" />
          <Settings.SidebarItem value="upgrade" />
        </Settings.SidebarList>
      </Settings.Sidebar>

      <Settings.Content id="general">general</Settings.Content>
      <Settings.Content id="teams">teams</Settings.Content>
      <Settings.Content id="roles">roles</Settings.Content>
      <Settings.Content id="members">members</Settings.Content>
      <Settings.Content id="upgrade">upgrade</Settings.Content>

      <Settings.Close />
    </Settings>
  );
}

export default WorkspaceSettingsPage;
