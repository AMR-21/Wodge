import type * as Party from "partykit/server";
import { badRequest, getRoute } from "../../lib/http-utils";

import UserParty from "../user-party";
import { getUserWorkspaces } from "../handlers/get-user-workspace";

export async function handleGet(req: Party.Request, party: UserParty) {
  const route = getRoute(req);
  switch (route) {
    case "/workspaces":
      return await getUserWorkspaces(req, party);
    default:
      return badRequest();
  }
}
