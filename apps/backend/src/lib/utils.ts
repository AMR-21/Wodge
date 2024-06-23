import type * as Party from "partykit/server";

import WorkspaceParty from "../workspace/workspace-party";
import RoomParty from "../room/room-party";
import ThreadParty from "../thread/thread-party";
import PageParty from "../page/page-party";

export function getMember(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.members.find(
    (member) => member.id === userId
  );
}

export function isUserOwner(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.createdBy === userId;
}

export function isMemberInWorkspace(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.members.some(
    (member) => member.id === userId
  );
}

// export function getRoles(rolesIds: string[], party: WorkspaceParty) {
//   return rolesIds.map((roleId) =>
//     party.workspaceStructure.data.roles.find((role) => role.id === roleId)
//   );
// }

export function isAllowed(req: Party.Request, party: WorkspaceParty) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return false;

  const isOwner = isUserOwner(userId, party);

  const requestingMember = getMember(userId, party);

  if (!requestingMember) return false;

  // const roles = getRoles(requestingMember.roles, party) as Role[];

  // if (!isOwner && !grant(roles, permissions)) return false;
  if (!isOwner) return false;

  return true;
}

export async function pokeWorkspace(
  wid: string,
  party: RoomParty | ThreadParty | PageParty
) {
  const workspaceParty = party.room.context.parties.workspace?.get(wid);

  if (workspaceParty) {
    await workspaceParty.fetch("/service/poke-channel", {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
        channelId: party.room.id,
      },
    });
  }
}
