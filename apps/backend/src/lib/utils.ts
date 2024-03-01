import type * as Party from "partykit/server";

import WorkspaceParty from "../workspace/workspace-party";
import { Role, grant } from "@repo/data";

export function getMember(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.members.find(
    (member) => member.id === userId
  );
}

export function isUserOwner(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.owner === userId;
}

export function isMemberInWorkspace(userId: string, party: WorkspaceParty) {
  return party.workspaceMembers.data.members.some(
    (member) => member.id === userId
  );
}

export function getRoles(rolesIds: string[], party: WorkspaceParty) {
  return rolesIds.map((roleId) =>
    party.workspaceStructure.data.roles.find((role) => role.id === roleId)
  );
}

export function isAllowed(req: Party.Request, party: WorkspaceParty) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return false;

  const isOwner = isUserOwner(userId, party);

  const requestingMember = getMember(userId, party);

  if (!requestingMember) return false;

  const roles = getRoles(requestingMember.roles, party) as Role[];

  if (!isOwner && !grant(roles, ["admin"])) return false;

  return true;
}
