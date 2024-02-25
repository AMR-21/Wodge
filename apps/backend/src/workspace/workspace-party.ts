import type * as Party from "partykit/server";
import { ok, unauthorized } from "../lib/http-utils";
import { getSession } from "../lib/auth";
import { WorkspacePartyInterface } from "../types";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      // Authorize the user by checking that session.userId matches the target user id (party id)
      if (session.userId !== lobby.id) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }
  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {}
}
