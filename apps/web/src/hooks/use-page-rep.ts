import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Replicache } from "replicache";
import { createPageRep, pageMutators } from "@repo/data";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useAppState } from "@/store/store";

export function useCurrentPageRep() {
  const { structure, workspaceId } = useCurrentWorkspace();

  const { teamId, channelId, folderId } = useParams<{
    teamId: string;
    channelId: string;
    folderId: string;
  }>();

  const { setChannelRep } = useAppState().actions;

  const { user } = useCurrentUser();

  const [rep, setRep] = useState<Replicache<typeof pageMutators> | undefined>(
    undefined,
  );

  const team = useMemo(() => {
    return structure.teams.find((t) => t.id === teamId);
  }, [teamId, structure.teams]);

  const folder = useMemo(() => {
    return team?.folders.find((r) => r.id === folderId);
  }, [team, folderId]);

  const channel = useMemo(() => {
    return folder?.channels.find((c) => c.id === channelId);
  }, [folder, channelId]);

  useEffect(() => {
    if (workspaceId && team && channel && user && !rep) {
      const repTemp = createPageRep({
        channelId: channel.id,
        workspaceId,
        teamId: team.id,
        userId: user.id,
        folderId,
      });

      setRep(repTemp);
      setChannelRep(repTemp);
    }
  }, [workspaceId, team, channel, structure.teams, user]);

  return rep;
}
