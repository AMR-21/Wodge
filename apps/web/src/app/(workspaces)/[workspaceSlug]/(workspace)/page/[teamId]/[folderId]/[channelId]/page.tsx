"use client";

import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useUpdateRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";
import { PageEditor } from "../../../page-editor";
import { MemberMultiSelect } from "../member-multi-select";
import KanbanBoard from "../kanban-board";
import { PageProvider } from "../../../provider";

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
    <PageProvider>
      <PageEditor
        channelId={channelId}
        folderId={folderId}
        user={user}
        teamId={teamId}
        workspaceId={workspaceId}
      />
    </PageProvider>
  );
}

export default ChannelPage;
