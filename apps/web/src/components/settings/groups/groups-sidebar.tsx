import { useContext } from "react";
import {
  SettingsContext,
  SettingsSidebarAccordionPlaceHolder,
} from "../settings";
import { SidebarItem } from "../../workspace/sidebar-item";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { cn } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function GroupsSidebar() {
  const isDesktop = useIsDesktop();
  const { activeItemId, dispatch } = useContext(SettingsContext);

  const { structure } = useCurrentWorkspace();

  const groups = structure.groups;

  if (groups.length === 0)
    return (
      <SettingsSidebarAccordionPlaceHolder>
        No groups
      </SettingsSidebarAccordionPlaceHolder>
    );

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <SidebarItem
          key={group.id}
          label={group.name}
          noIcon
          className={cn(
            "justify-start py-1.5  pr-1.5 capitalize",
            activeItemId === group.id && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            dispatch({
              type: "openAccordionItem",
              payload: {
                value: "groups",
                id: group.id,
                isSidebarOpen: isDesktop,
              },
            });
          }}
        />
      ))}
    </div>
  );
}
