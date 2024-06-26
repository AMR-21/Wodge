import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { ChannelsTypes } from "@repo/data";
import { useParams } from "next/navigation";
import { produce } from "immer";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { recentlyVisitedAtom } from "@/store/global-atoms";

export function useRecentlyVisited() {
  const { workspaceId, structure } = useCurrentWorkspace();
  const recentlyVisitedRecord = useAtomValue(recentlyVisitedAtom);

  if (!workspaceId) return [];

  return recentlyVisitedRecord[workspaceId];
}

export function useUpdateRecentlyVisited(type: ChannelsTypes) {
  const { workspaceId } = useCurrentWorkspace();
  const { channelId, teamId, folderId } = useParams<{
    channelId?: string;
    teamId: string;
    folderId?: string;
  }>();

  const setRecentlyVisited = useSetAtom(recentlyVisitedAtom);

  useEffect(() => {
    if (!workspaceId) return;

    setRecentlyVisited((recentlyVisitedRecord) => {
      const workspaceRecentlyVisited = recentlyVisitedRecord[workspaceId] ?? [];

      const newRecentlyVisited = produce(workspaceRecentlyVisited, (draft) => {
        const chanIdx = draft.findIndex((item) => item.channelId === channelId);

        if (chanIdx !== -1) {
          draft.splice(chanIdx, 1);
        }

        draft.unshift({
          type,
          channelId,
          teamId,
          folderId,
          time: new Date().toISOString(),
        });

        if (draft.length > 15) draft.pop();
      });

      return {
        ...recentlyVisitedRecord,
        [workspaceId]: newRecentlyVisited,
      };
    });
  }, [workspaceId]);
}
