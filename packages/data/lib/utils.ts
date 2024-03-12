import { env } from "@repo/env";
import { WorkspacesRegistry } from "../models/workspace/workspace-registry";

export function replicacheWrapper<Request, Result>(
  mode: "push" | "pull",
  domain: "user" | "workspace",
  id: string
) {
  return async (requestBody: Request, requestID: string) => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/replicache-${mode}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();

      console.log({ response });

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

export function getWorkspace(id: string) {
  const workspacesRegistry = WorkspacesRegistry.getInstance();
  const workspace = workspacesRegistry.getWorkspace(id);

  return workspace;
}
