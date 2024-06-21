import { env } from "@repo/env";
import { makeWorkspaceMembersKey } from "./keys";
import { queryClient } from "./query-client";
import { ChannelsTypes } from "../schemas/channel.schema";

export function replicacheWrapper<Request, Result>(
  mode: "push" | "pull",
  domain: "user" | "workspace" | ChannelsTypes,
  id: string,
  headers?: Record<string, string>
) {
  return async (requestBody: Request, requestID: string) => {
    try {
      const res = await fetch(`/api/replicache/${mode}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          ...headers,
          domain,
          id,
        },
      });

      if (res.status === 401) {
        queryClient.invalidateQueries({
          queryKey: ["user-workspaces"],
        });
      }

      const response = await res.json();

      if (
        mode === "pull" &&
        domain === "workspace" &&
        //@ts-ignore
        response?.patch?.map((p) => p.key)?.includes(makeWorkspaceMembersKey())
      ) {
        queryClient.invalidateQueries({
          queryKey: [id, "members"],
        });
      }
      return {
        httpRequestInfo: {
          httpStatusCode: res.status,
          errorMessage: res.status !== 200 ? res.statusText : "",
        },

        ...(mode === "pull" && { response }),
      } as Result;
    } catch {
      return {
        httpRequestInfo: {
          httpStatusCode: 500,
          errorMessage: "Internal Server Error",
        },
      } as Result;
    }
  };
}

export function getBucketAddress(wid: string) {
  return btoa(wid).toLowerCase();
}

export function getAvatarAddress(id?: string) {
  return `${env.NEXT_PUBLIC_AVATARS_URL}/${id}`;
}

export function makeWorkspaceAvatarKey(id: string) {
  return `wrk_${id}`;
}

export function makeUserAvatarKey(id: string) {
  return `usr_${id}`;
}
