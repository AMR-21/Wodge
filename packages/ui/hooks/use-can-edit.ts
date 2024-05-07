import { canEdit, ChannelsTypes } from "@repo/data";
import { useCurrentWorkspace } from "./use-current-workspace";
import { useParams } from "next/navigation";
import { useCurrentUser } from "./use-current-user";
import { useEffect, useState } from "react";
import { useIsOwnerOrAdmin } from "./use-is-owner-or-admin";
import { useIsTeamModerator } from "./use-is-team-moderator";

export function useCanEdit({
  type,
  forceTeamId,
  forceChannelId,
  forceFolderId,
}: {
  type: ChannelsTypes;
  forceTeamId?: string;
  forceChannelId?: string;
  forceFolderId?: string;
}) {
  const { structure, members } = useCurrentWorkspace();

  const { teamId, channelId, folderId } = useParams<{
    teamId: string;
    channelId: string;
    folderId: string;
  }>();

  const { user } = useCurrentUser();

  const [grant, setGrant] = useState(false);

  const isAdminOrOwner = useIsOwnerOrAdmin();

  useEffect(() => {
    setGrant(
      isAdminOrOwner ||
        canEdit({
          members,
          structure,
          teamId: forceTeamId || teamId,
          channelId: forceChannelId || channelId,
          channelType: type,
          userId: user?.id,
          ...(type === "page" && { folderId: forceFolderId || folderId }),
        }),
    );
  }, [
    isAdminOrOwner,
    structure,
    teamId,
    user?.id,
    members,
    channelId,
    folderId,
    type,
  ]);
  return grant;
}
