import { useParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Replicache } from "replicache";
import {
  createThreadRep,
  threadMutators,
} from "@repo/data";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useAppState } from "@/store/store";

export function useCurrentThreadRep() {
  const { structure, workspaceId } = useCurrentWorkspace();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { setChannelRep } = useAppState().actions;

  const { user } = useCurrentUser();

  const [rep, setRep] = useState<Replicache<typeof threadMutators> | undefined>(
    undefined,
  );

  const team = useMemo(() => {
    return structure.teams.find((t) => t.id === teamId);
  }, [teamId, structure.teams]);

  const channel = useMemo(() => {
    return team?.threads.find((r) => r.id === channelId);
  }, [team, channelId]);

  useEffect(() => {
    if (workspaceId && team && channel && user && !rep) {
      const repTemp = createThreadRep({
        channelId: channel.id,
        workspaceId,
        teamId: team.id,
        userId: user.id,
      });

      setRep(repTemp);
      setChannelRep(repTemp);
    }
  }, [workspaceId, team, channel, structure.teams, user]);

  return rep;
}
