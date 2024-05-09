import { ChannelsTypes } from "@repo/data";
import { atomWithStorage } from "jotai/utils";

export const activeSidebarAtom = atomWithStorage<ChannelsTypes | "home">(
  "activeSidebar",
  "page",
);

export const openTeamsAtom = atomWithStorage<Record<string, boolean>>(
  "openTeams",
  {},
);
