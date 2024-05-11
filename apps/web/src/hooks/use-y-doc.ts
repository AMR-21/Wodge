import { env } from "@repo/env";
import useYProvider from "y-partykit/react";

import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

interface YDocProps {
  channelId: string;
  folderId: string;
  teamId: string;
  workspaceId: string;
}

export function useYDoc({
  channelId,
  folderId,
  teamId,
  workspaceId,
}: YDocProps) {
  const yDoc = new Y.Doc();
  const idbProvider = new IndexeddbPersistence(channelId, yDoc);

  const provider = useYProvider({
    room: channelId,
    host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    party: "page",
    doc: yDoc,
    options: {
      params: () => ({
        folderId,
        teamId,
        workspaceId,
      }),
    },
  });

  return { provider, idbProvider };
}
