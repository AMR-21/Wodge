import WorkspaceParty from "../workspace-party";
import { error, json } from "../../lib/http-utils";

export async function getMembersInfo(party: WorkspaceParty) {
  const res = await fetch(`${party.room.env.AUTH_DOMAIN}/api/member`, {
    method: "POST",
    headers: {
      Authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({
      membersIds: party.workspaceMembers.data.members.map((m) => m.id),
    }),
  });

  if (!res.ok) return error("Failed to fetch user info");

  const members = await res.json();

  return json(members);
}
