import { useParams, usePathname } from "next/navigation";
import { useCurrentWorkspace } from "./use-current-workspace";

export function useChannelPath() {
  const { folderId, channelId, teamId } = useParams<{
    teamId?: string;
    folderId?: string;
    channelId?: string;
  }>();

  const pathname = usePathname().split("/").at(2);
  const isPage = pathname === "page";
  const isRoom = pathname === "room";
  const isThread = pathname === "thread";

  const { structure } = useCurrentWorkspace();

  if (!teamId) {
    return null;
  }

  const team = structure.teams.find((t) => t.id === teamId);

  if (!team) {
    return null;
  }

  if (isPage) {
    const folder = team.folders.find((f) => f.id === folderId);
    const page = folder?.channels.find((p) => p.id === channelId);
    return {
      team: team.name,
      folder: folder?.name,
      folderId: folder?.id,
      page: page?.name,
    };
  }

  if (isRoom) {
    const room = team.rooms.find((r) => r.id === channelId);
    return {
      team: team.name,
      room: room?.name,
      roomId: room?.id,
    };
  }

  if (isThread) {
    const thread = team.threads.find((t) => t.id === channelId);
    return {
      team: team.name,
      thread: thread?.name,
      createdBy: thread?.createdBy,
      isResolved: thread?.isResolved,
    };
  }

  return {
    team: team.name,
  };
}
