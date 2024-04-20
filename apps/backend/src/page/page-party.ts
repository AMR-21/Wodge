/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getSession } from "../lib/auth";
import {
  PokeMessage,
  REPLICACHE_VERSIONS_KEY,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { UserPartyInterface, Versions } from "../types";
import queryString from "query-string";
export default class PageParty implements Party.Server {
  // options: Party.ServerOptions = {
  //   hibernate: true,
  // };

  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection) {
    return await onConnect(conn, this.room, {
      // ...options

      persist: {
        mode: "snapshot",
      },
    });
  }

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

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      return authorizeChannel(
        req,
        lobby,
        session.userId,
        "page",
        queryString.parse(req.url) as {
          folderId: string;
          teamId: string;
          workspaceId: string;
        }
      );
    } catch (e) {
      return unauthorized();
    }
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      return authorizeChannel(req, lobby, session.userId, "page");
    } catch (e) {
      return unauthorized();
    }
  }
}
PageParty satisfies Party.Worker;
