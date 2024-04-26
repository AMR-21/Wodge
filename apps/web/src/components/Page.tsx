import { PublicUserType } from "@repo/data";
import { BlockEditor } from "@repo/editor";
import { env } from "@repo/env";
import useYProvider from "y-partykit/react";
import * as Y from "yjs";

export function Page({
  channelId,
  folderId,
  workspaceId,
  teamId,
  user,
}: {
  channelId: string;
  folderId: string;
  workspaceId: string;
  teamId: string;
  user: PublicUserType;
}) {
  const provider = useYProvider({
    room: channelId,
    host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    party: "page",
    options: {
      params: () => ({
        folderId,
        teamId,
        workspaceId,
      }),
    },
  });

  return <BlockEditor ydoc={provider.doc} provider={provider} user={user} />;
}