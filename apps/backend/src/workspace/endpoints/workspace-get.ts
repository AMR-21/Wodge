import type * as Party from "partykit/server";

import { badRequest, getRoute } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import { getMembership } from "../handlers/get-membership";

export async function handleGet(req: Party.Request, party: WorkspaceParty) {
  const route = getRoute(req);

  switch (route) {
    case "/get-membership":
      return getMembership(req, party);
    default:
      return badRequest();
  }
}
