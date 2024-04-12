import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import { env } from "@repo/env";
import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
} from "replicache";
import { ChannelsTypes, replicacheWrapper } from "@repo/data";

export function createChannelRep({
  channelId,
  userId,
  workspaceId,
  teamId,
  folderId,
  channelType,
}: {
  userId: string;
  workspaceId: string;
  channelId: string;
  teamId: string;
  folderId?: string;
  channelType: ChannelsTypes;
}) {
  return new Replicache<typeof workspaceMutators>({
    name: `${userId}-${channelId}`,
    licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
    mutators: workspaceMutators,
    pullInterval: null,
    pushURL: undefined,
    pullURL: undefined,
    puller: replicacheWrapper<PullRequest, PullerResult>(
      "pull",
      channelType,
      channelId,
      {
        "x-workspace-id": workspaceId,
        "x-team-id": teamId,
        ...(folderId && { "x-folder-id": folderId }),
      },
    ),
    pusher: replicacheWrapper<PushRequest, PusherResult>(
      "push",
      channelType,
      workspaceId,
      {
        "x-workspace-id": workspaceId,
        "x-team-id": teamId,
        ...(folderId && { "x-folder-id": folderId }),
      },
    ),
  });
}
