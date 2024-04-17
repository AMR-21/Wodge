import { env } from "@repo/env";
import { makeWorkspaceMembersKey } from "./keys";
import { queryClient } from "./query-client";
import { PullResponseV1, PullerResult } from "replicache";
import { ChannelsTypes } from "../schemas/channel.schema";

export function replicacheWrapper<Request, Result>(
  mode: "push" | "pull",
  domain: "user" | "workspace" | ChannelsTypes,
  id: string,
  headers?: Record<string, string>
) {
  return async (requestBody: Request, requestID: string) => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/replicache-${mode}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(requestBody),
          headers,
        }
      );

      if (!res.ok) throw new Error("Network response was not ok");

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
