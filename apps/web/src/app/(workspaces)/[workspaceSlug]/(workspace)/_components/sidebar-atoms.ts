import { ChannelsTypes } from "@repo/data";
import { atomWithStorage } from "jotai/utils";

export const activeSidebarAtom = atomWithStorage<ChannelsTypes | "home">(
  "activeSidebar",
  "page",
);
