import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { json, unauthorized } from "../../lib/http-utils";
import { canEdit, canView, ChannelsTypes, isAdmin, isOwner } from "@repo/data";

export interface AuthChannelResponse {
  success: boolean;
  isMember?: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  canEdit?: boolean;
  canView?: boolean;
}

export function authChannel(req: Party.Request, party: WorkspaceParty) {
  const serviceKey = req.headers.get("authorization");

  // from rep wrapper
  const workspaceId = req.headers.get("x-workspace-id");
  const teamId = req.headers.get("x-team-id") as string | undefined;
  const folderId = req.headers.get("x-folder-id") as string | undefined;

  // from channel party
  const userId = req.headers.get("x-user-id") as string;
  const channelId = req.headers.get("x-channel-id") as string;
  const channelType = req.headers.get("x-channel-type") as ChannelsTypes;

  // Verify service key
  if (serviceKey !== party.room.env.SERVICE_KEY)
    return json({
      success: false,
    } satisfies AuthChannelResponse);

  if (workspaceId !== party.room.id) return unauthorized();

  if (party.workspaceMembers.data.createdBy === userId)
    return json({
      success: true,
      isOwner: true,
    } as AuthChannelResponse);

  if (
    !party.workspaceMembers.data.members.some((member) => member.id === userId)
  )
    return json({
      success: false,
    });

  if (isAdmin({ members: party.workspaceMembers.data, userId })) {
    return json({
      success: true,
      isAdmin: true,
      canEdit: true,
      canView: true,
    });
  }

  if (
    canEdit({
      members: party.workspaceMembers.data,
      userId,
      channelId,
      structure: party.workspaceStructure.data,
      channelType,
      folderId,
      teamId,
    })
  ) {
    return json({
      success: true,
      canEdit: true,
      canView: true,
    });
  }

  if (
    canView({
      members: party.workspaceMembers.data,
      userId,
      channelId,
      structure: party.workspaceStructure.data,
      channelType,
      folderId,
      teamId,
    })
  ) {
    return json({
      success: true,
      canEdit: false,
      canView: true,
    });
  }

  return json({
    success: false,
  });
}
