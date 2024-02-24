import { env } from "@repo/env";
import { toast } from "@repo/ui";

export function replicacheWrapper<Request, Result>(
  mode: "push" | "pull",
  domain: "user" | "workspace",
  id: string
) {
  return async (requestBody: Request, requestID: string) => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/replicache-${mode === "push" ? "push" : "pull"}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();

      return {
        httpRequestInfo: {
          httpStatusCode: res.status,
          errorMessage: res.status !== 200 ? res.statusText : "",
        },

        ...(mode === "pull" && { response }),
      } as Result;
    } catch {
      toast.error("Sync failed");
      return {
        httpRequestInfo: {
          httpStatusCode: 500,
          errorMessage: "Internal Server Error",
        },
      } as Result;
    }
  };
}
