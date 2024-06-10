import { env } from "@repo/env";
import { toast } from "sonner";

export class API {
  public static uploadImage = async (
    file: File,
    workspaceId: string,
    teamId: string,
    channelId: string,
  ) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/file/${teamId}/${channelId}`,
      { method: "POST", body: formData, credentials: "include" },
    );

    if (!res.ok) {
      toast.error("Something went wrong");
      return;
    }

    const data = await res.json<{ fileId: string }>();

    const linkRes = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/file/${teamId}/${channelId}/${btoa(data.fileId)}`,
      { credentials: "include" },
    );

    const link = await linkRes.json<{ downloadUrl: string }>();

    return link.downloadUrl;
  };
}

export default API;
