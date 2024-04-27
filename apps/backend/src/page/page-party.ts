/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getCurrentUser } from "../lib/auth";
import {
  PokeMessage,
  REPLICACHE_VERSIONS_KEY,
  makeWorkspacesStoreKey,
} from "@repo/data";
import queryString from "query-string";

import { Ai } from "partykit-ai";

export default class PageParty implements Party.Server {
  // options: Party.ServerOptions = {
  //   hibernate: true,
  // };
  ai: Ai;
  constructor(readonly room: Party.Room) {
    this.ai = new Ai(room.context.ai);
  }

  async onStart() {
    // this.ai = new Ai(this.room.context.ai);
  }

  async onConnect(conn: Party.Connection) {
    return await onConnect(conn, this.room, {
      // ...options

      persist: {
        mode: "snapshot",
      },
    });
  }

  async onRequest(req: Party.Request) {
    const result = await this.ai.run("@cf/meta/llama-2-7b-chat-fp16", {
      prompt: "What is the capital of France?",
      // stream: true,
    });

    // return new Response(result, {
    // headers: { "content-type": "text/event-stream" },
    // });
    return Response.json(result);
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
      const user = await getCurrentUser(req, lobby);

      return authorizeChannel(
        req,
        lobby,
        user.id,
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

    return req;

    try {
      const user = await getCurrentUser(req, lobby);

      return authorizeChannel(req, lobby, user.id, "page");
    } catch (e) {
      return unauthorized();
    }
  }
}
PageParty satisfies Party.Worker;
