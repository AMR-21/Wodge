import { cn, useIsDesktop } from "@repo/ui";
import { useContext } from "react";
import {
  SettingsContext,
  SettingsSidebarAccordionPlaceHolder,
} from "../settings";
import { Team } from "@repo/data";
import { SidebarItem } from "../../workspace/sidebar-item";
import { is } from "drizzle-orm";
import { useCurrentWorkspace } from "../../workspace/workspace-context";

export function TeamsSidebar() {
  const isDesktop = useIsDesktop();
  const { activeItemId, dispatch } = useContext(SettingsContext);

  const { structure } = useCurrentWorkspace();

  const teams = structure.teams;

  if (teams.length === 0)
    return (
      <SettingsSidebarAccordionPlaceHolder>
        No teams
      </SettingsSidebarAccordionPlaceHolder>
    );

  return (
    <div className="flex flex-col gap-1">
      {teams.map((team) => (
        <SidebarItem
          key={team.id}
          label={team.name}
          noIcon
          className={cn(
            "justify-start py-1.5  pr-1.5 capitalize",
            activeItemId === team.id && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            dispatch({
              type: "openAccordionItem",
              payload: {
                value: "teams",
                id: team.id,
                isSidebarOpen: isDesktop,
              },
            });
          }}
        />
      ))}
    </div>
  );
}
