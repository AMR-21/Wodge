import {
  PullerResult,
  PullRequest,
  PusherResult,
  PushRequest,
  Replicache,
} from "replicache";
import { roomMutators } from "./room-mutators";
import { env } from "@repo/env";
import { replicacheWrapper } from "../../lib/utils";

export function createRoomRep({
  channelId,
  userId,
  workspaceId,
  teamId,
}: {
  userId: string;
  workspaceId: string;
  channelId: string;
  teamId: string;
}) {
  return new Replicache<typeof roomMutators>({
    name: `${userId}-${channelId}`,
    licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
    mutators: roomMutators,
    pullInterval: null,
    pushURL: undefined,
    pullURL: undefined,
    puller: replicacheWrapper<PullRequest, PullerResult>(
      "pull",
      "room",
      channelId,
      {
        "x-workspace-id": workspaceId,
        "x-team-id": teamId,
      }
    ),
    pusher: replicacheWrapper<PushRequest, PusherResult>(
      "push",
      "room",
      workspaceId,
      {
        "x-workspace-id": workspaceId,
        "x-team-id": teamId,
      }
    ),
  });
}
