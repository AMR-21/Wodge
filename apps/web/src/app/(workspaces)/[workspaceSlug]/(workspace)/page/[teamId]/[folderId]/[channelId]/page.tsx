"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useUpdateRecentlyVisited } from "@/hooks/use-recently-visited";
import { PageEditor } from "../../../page-editor";

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
      <PageEditor
        channelId={channelId}
        folderId={folderId}
        user={user}
        teamId={teamId}
        workspaceId={workspaceId}
      />
  );
}

export default ChannelPage;
