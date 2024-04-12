/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getSession } from "../lib/auth";
import {
  PokeMessage,
  REPLICACHE_VERSIONS_KEY,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { UserPartyInterface, Versions } from "../types";

export default class UserParty implements Party.Server {
  options: Party.ServerOptions = {
    hibernate: true,
  };

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
      return authorizeChannel(req, lobby, session.userId);
    } catch (e) {
      return unauthorized();
    }
  }
}
UserParty satisfies Party.Worker;
