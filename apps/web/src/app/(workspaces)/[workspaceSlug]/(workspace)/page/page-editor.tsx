import { users } from "@repo/data";

import { BlockEditor, useYDoc } from "@repo/editor";
import { env } from "@repo/env";
import useYProvider from "y-partykit/react";
import * as Y from "yjs";
import { usePageDoc } from "./provider";

export function PageEditor({
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
  user: typeof users.$inferSelect;
}) {
  const { provider } = useYDoc({
    channelId,
    folderId,
    teamId,
    workspaceId,
  });

  return <BlockEditor ydoc={provider.doc} provider={provider} user={user} />;
}
