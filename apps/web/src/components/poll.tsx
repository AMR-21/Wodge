"use client";

export type Poll = {
  title: string;
  options: string[];
  votes?: number[];
};
import usePartySocket from "partysocket/react";
import { useEffect, useMemo, useState } from "react";
import { PollOptions } from "./poll-options";
import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { Thread } from "@repo/data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRoomRep } from "@/hooks/use-room-rep";

export default function PollUI({
  id,
  options,
  votes,
  pollVoters,
  isRoom = false,
}: {
  id: string;
  options: string[];
  votes?: number[];
  pollVoters?: Thread["pollVoters"];
  isRoom: boolean;
}) {
  const { teamId } = useParams<{ teamId: string }>();
  const { workspaceRep } = useCurrentWorkspace();
  const { user } = useCurrentUser();
  const vote = useMemo(
    () => pollVoters?.find((p) => p.voter === user?.id)?.option,
    [pollVoters, user],
  );

  const rep = useCurrentRoomRep();
  const sendVote = async (option: number) => {
    if (!vote)
      isRoom
        ? await rep?.mutate.vote({ msgId: id, teamId, option })
        : await workspaceRep?.mutate.vote({
            teamId,
            threadId: id,
            option,
          });
  };

  const removeVote = async () => {
    if (vote !== undefined)
      isRoom
        ? await rep?.mutate.removeVote({ msgId: id, teamId, option: vote })
        : await workspaceRep?.mutate.removeVote({
            teamId,
            threadId: id,
            option: vote,
          });
  };

  return (
    <PollOptions
      options={options}
      votes={votes}
      vote={vote}
      setVote={sendVote}
      removeVote={removeVote}
      isRoom={isRoom}
    />
  );
}
