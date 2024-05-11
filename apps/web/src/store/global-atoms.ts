import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { ChannelsTypes } from "@repo/data";

export interface RecentlyVisitedItem {
  type: ChannelsTypes;
  teamId: string;
  time: string;
  channelId?: string;
  folderId?: string;
}

export const isSidebarOpenAtom = atom(true);

export const recentlyVisitedAtom = atomWithStorage<
  Record<string, RecentlyVisitedItem[]>
>("recentlyVisited", {});
