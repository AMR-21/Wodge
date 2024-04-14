import type * as Party from "partykit/server";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getSession } from "../lib/auth";
import { ServerThreadMessages, ThreadPartyInterface, Versions } from "../types";

export default class ThreadParty implements Party.Server, ThreadPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  threadMessages: ServerThreadMessages;
  versions: Versions;

  constructor(readonly room: Party.Room) {}

  async onRequest(req: Party.Request) {
    // switch (req.method) {
    //   case "POST":
    //     return await handlePost(req, this);
    //   case "GET":
    //     return await handleGet(req, this);
    //   case "OPTIONS":
    //     return ok();
    //   default:
    //     return notImplemented();
    // }
    return ok();
  }
  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);
      return authorizeChannel(req, lobby, session.userId, "thread");
    } catch (e) {
      return unauthorized();
    }
  }
}

ThreadParty satisfies Party.Worker;
