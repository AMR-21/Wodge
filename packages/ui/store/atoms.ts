import { ChannelsTypes } from "@repo/data";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isSidebarOpenAtom = atom(true);
export const updateAtom = atom(false);

export interface RecentlyVisitedItem {
  type: ChannelsTypes;
  teamId: string;
  time: string;
  channelId?: string;
  folderId?: string;
}

export const recentlyVisitedAtom = atomWithStorage<
  Record<string, RecentlyVisitedItem[]>
>("recentlyVisited", {});
