"use client";

import { BlockEditor } from "@repo/editor";

import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const yDoc = new Y.Doc();

const provider = new YPartyKitProvider(
  "localhost:1999",
  "my-document-name",
  yDoc,
);
function ChannelPage() {
  return <BlockEditor ydoc={yDoc} provider={provider} />;
}

export default ChannelPage;
