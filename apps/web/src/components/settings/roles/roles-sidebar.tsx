import { useContext } from "react";
import {
  SettingsContext,
  SettingsSidebarAccordionPlaceHolder,
} from "../settings";
import { SidebarItem } from "../../workspace/sidebar-item";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { nanoid } from "nanoid";
import { WORKSPACE_ROLE_ID_LENGTH } from "@repo/data";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { cn } from "@repo/ui/lib/utils";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

export function RolesSidebar() {
  const isDesktop = useIsDesktop();
  const { activeItemId, dispatch } = useContext(SettingsContext);

  const user = useCurrentUser();
  const { structure } = useCurrentWorkspace();

  const roles = [
    {
      id: "nanoid(WORKSPACE_ROLE_ID_LENGTH)",
      name: "Admin",
      permissions: [],
      members: [],
      createdBy: user?.id || "",
      linkedTeams: [],
      color: "#123131",
    },
  ];

  if (roles.length === 0)
    return (
      <SettingsSidebarAccordionPlaceHolder>
        No roles
      </SettingsSidebarAccordionPlaceHolder>
    );

  return (
    <div className="flex flex-col gap-1">
      {roles.map((role) => (
        <SidebarItem
          key={role.id}
          label={role.name}
          noIcon
          className={cn(
            "justify-start py-1.5  pr-1.5 capitalize",
            activeItemId === role.id && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            dispatch({
              type: "openAccordionItem",
              payload: {
                value: "roles",
                id: role.id,
                isSidebarOpen: isDesktop,
              },
            });
          }}
        />
      ))}
    </div>
  );
}
