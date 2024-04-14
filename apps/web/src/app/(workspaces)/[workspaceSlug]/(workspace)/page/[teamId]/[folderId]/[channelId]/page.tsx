"use client";

import { BlockEditor } from "@repo/editor";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const yDoc = new Y.Doc();

const provider = new YPartyKitProvider(
  "localhost:1999",
  "my-document-name",
  yDoc,
);
function ChannelPage() {
  const { user } = useCurrentUser();

  if (!user) return null;

  return <BlockEditor ydoc={yDoc} provider={provider} user={user} />;
}

export default ChannelPage;
