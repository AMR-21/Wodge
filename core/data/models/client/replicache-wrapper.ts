import { request } from "http";
import { PullRequest, PullerResult, PusherResult } from "replicache";

export function replicacheWrapper<Request, Result>(
  mode: "push" | "pull",
  id: string
) {
  return async (requestBody: Request, requestID: string) => {
    try {
      const res = await fetch(
        `http://localhost:1999/parties/user/${id}/replicache-${mode === "push" ? "push" : "pull"}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      const response = await res.json();

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
