import { useContext } from "react";
import {
  SettingsContext,
  SettingsSidebarAccordionPlaceHolder,
} from "../settings";
import { Team } from "@repo/data";
import { SidebarItem } from "../../workspace/sidebar-item";
import { is } from "drizzle-orm";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { cn } from "@repo/ui/lib/utils";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

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
        <li key={team.id} className="group flex grow">
          <SidebarItem
            noIcon
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
          >
            <Avatar className="mr-1.5 h-5 w-5 shrink-0 rounded-md border border-primary/30 text-xs">
              {/* <AvatarImage src={workspace?.avatar} /> */}
              <AvatarFallback className="select-none rounded-md text-xs uppercase">
                {team.name[0]}
              </AvatarFallback>
            </Avatar>

            <span className="select-none truncate">{team.name}</span>
          </SidebarItem>
        </li>
      ))}
    </div>
  );
}
