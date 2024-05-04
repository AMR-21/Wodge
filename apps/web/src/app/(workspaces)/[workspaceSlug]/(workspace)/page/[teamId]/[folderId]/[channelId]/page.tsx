"use client";

import { BlockEditor } from "@repo/editor";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import useYProvider from "y-partykit/react";
import { useParams } from "next/navigation";
import { env } from "@repo/env";
import { Page } from "@/components/Page";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useUpdateRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";

function ChannelPage() {
  useUpdateRecentlyVisited("page");
  const { user } = useCurrentUser();

  const { channelId, folderId, teamId } = useParams<{
    channelId: string;
    folderId: string;
    teamId: string;
  }>();

  const { workspaceId } = useCurrentWorkspace();

  if (!user || !workspaceId) return null;

  return (
    <Page
      channelId={channelId}
      folderId={folderId}
      user={user}
      teamId={teamId}
      workspaceId={workspaceId}
    />
  );
}

export default ChannelPage;
