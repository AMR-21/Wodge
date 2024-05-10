"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentResources } from "@repo/ui/hooks/use-current-resources";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { AdvancedUploadButton } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/resources/advanced-upload";

import { useRouter } from "next/navigation";
import { FoldersBreadcrumbs } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/resources/folders-breadcrumbs";
import { useUpdateRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";
import { useIsTeamModerator } from "@repo/ui/hooks/use-is-team-moderator";
import { Folders } from "./folders";
import { Files } from "./files";
import { Button } from "@repo/ui/components/ui/button";
import KanbanBoard from "../../../page/[teamId]/[folderId]/kanban-board";
import { MemberMultiSelect } from "../../../page/[teamId]/[folderId]/member-multi-select";

function TeamResourcePage({
  params: { path },
}: {
  params: {
    path: string[];
  };
}) {
  useUpdateRecentlyVisited("resources");

  const activePath = useChannelPath();

  const { workspaceId } = useCurrentWorkspace();

  const { files, dirs } = useCurrentResources();

  const router = useRouter();

  const isTeamModerator = useIsTeamModerator();

  if (!workspaceId) return null;

  if ((files?.length === 0 || dirs?.length === 0) && path?.length > 0) {
    router.back();
  }

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-xl">{activePath?.team.name} Resources</h2>
      <div className="flex h-8 items-center py-1.5">
        <FoldersBreadcrumbs />
        {isTeamModerator && (
          <div className="ml-1.5 shrink-0">
            <AdvancedUploadButton workspaceId={workspaceId} />
          </div>
        )}
      </div>

      <ScrollArea className="py-2.5">
        <div className="flex w-full flex-col divide-y-[1px]">
          <Folders workspaceId={workspaceId} />
          <Files workspaceId={workspaceId} />
        </div>
      </ScrollArea>
    </div>
  );
}

export default TeamResourcePage;
