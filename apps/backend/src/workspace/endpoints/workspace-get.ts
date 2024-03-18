import type * as Party from "partykit/server";

import { badRequest, getRoute } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import { getMembership } from "../handlers/get-membership";
import { getInvites } from "../handlers/get-invites";
import { getMemberInfo } from "../handlers/get-member-info";

export async function handleGet(req: Party.Request, party: WorkspaceParty) {
  const route = getRoute(req);

  switch (route) {
    case "/membership":
      return getMembership(req, party);
    case "/invites":
      return getInvites(req, party);

    default:
      return badRequest();
  }
}
