import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import { env } from "@repo/env";
import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
} from "replicache";
import { WorkspaceType, replicacheWrapper } from "@repo/data";

export function createWorkspaceRep(
  userId: string,
  workspaceId: string,
  environment: WorkspaceType["environment"],
) {
  return new Replicache<typeof workspaceMutators>({
    name: `${userId}-${workspaceId}`,
    licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
    mutators: workspaceMutators,
    pullInterval: null,
    pushURL: undefined,
    pullURL: undefined,
    ...(environment === "cloud"
      ? {
          puller: replicacheWrapper<PullRequest, PullerResult>(
            "pull",
            "workspace",
            workspaceId,
          ),
          pusher: replicacheWrapper<PushRequest, PusherResult>(
            "push",
            "workspace",
            workspaceId,
          ),
        }
      : {}),
  });
}
