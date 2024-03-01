import WorkspaceParty from "../workspace/workspace-party";

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
