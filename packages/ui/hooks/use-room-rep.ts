import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "./use-current-workspace";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Replicache } from "replicache";
import { createRoomRep, roomMutators } from "@repo/data";
import { useCurrentUser } from "./use-current-user";
import { useAppState } from "..";

export function useCurrentRoomRep() {
  const { structure, workspaceId } = useCurrentWorkspace();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { setChannelRep } = useAppState().actions;

  const { user } = useCurrentUser();

  const [rep, setRep] = useState<Replicache<typeof roomMutators> | undefined>(
    undefined,
  );

  const team = useMemo(() => {
    return structure.teams.find((t) => t.id === teamId);
  }, [teamId, structure.teams]);

  const channel = useMemo(() => {
    return team?.rooms.find((r) => r.id === channelId);
  }, [team, channelId]);

  useEffect(() => {
    if (workspaceId && team && channel && user && !rep) {
      const repTemp = createRoomRep({
        channelId: channel.id,
        workspaceId,
        teamId: team.id,
        userId: user.id,
      });

      console.log("setting", repTemp, channelId);
      setRep(repTemp);
      setChannelRep(repTemp);
    }
  }, [workspaceId, team, channel, structure.teams, user]);

  return rep;
}
