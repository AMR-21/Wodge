import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
} from "replicache";

import { env } from "@repo/env";
import { replicacheWrapper } from "@repo/data";
import { userMutators } from "@repo/data/models/user/user-mutators";

import { useAppState } from "./store";

export function createUserRep(userId: string) {
  useAppState.setState({
    userStore: new Replicache<typeof userMutators>({
      name: userId,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      pusher: replicacheWrapper<PushRequest, PusherResult>(
        "push",
        "user",
        userId,
      ),
      puller: replicacheWrapper<PullRequest, PullerResult>(
        "pull",
        "user",
        userId,
      ),
      pullInterval: null,
      mutators: { ...userMutators },
    }),
  });
}
