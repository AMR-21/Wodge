/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

import { getRoute, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, verifyToken } from "../lib/auth";
import queryString from "query-string";

import { Ai } from "partykit-ai";
import { Hono } from "hono";
import { PagePartyInterface, ServerPageDB, Versions } from "../types";
import { startFn } from "./start-fn";
import { pagePull } from "./page-pull";
import { pagePush } from "./page-push";

export default class PageParty implements Party.Server, PagePartyInterface {
  ai: Ai;
  db: ServerPageDB;
  versions: Versions;

  app: Hono = new Hono().basePath("/parties/page/:pageId");

  constructor(readonly room: Party.Room) {
    this.ai = new Ai(room.context.ai);
  }

  async onStart() {
    this.app.post("/replicache-pull", pagePull.bind(null, this));

    this.app.post("/replicache-push", pagePush.bind(null, this));
    startFn(this);
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const canEdit =
      ctx.request.headers.get("x-can-edit") === "true" ||
      ctx.request.headers.get("x-owner") === "true" ||
      ctx.request.headers.get("x-admin") === "true" ||
      ctx.request.headers.get("x-team-moderator") === "true";

    return await onConnect(conn, this.room, {
      // ...options

      readOnly: !canEdit,
      persist: {
        mode: "snapshot",
      },
      // callback: {
      //   async handler(yDoc) {
      //     // console.log("a callback @", new Date().toISOString());
      //   },
      // },
    });
  }

  async onRequest(req: Party.Request) {
    //@ts-ignore
    return this.app.fetch(req);
  }

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const payload = await verifyToken(req, lobby);

      if (!payload || !payload?.userId || payload?.isUpload) {
        return unauthorized();
      }

      req.headers.set("x-user-id", payload.userId as string);

      if (payload?.username)
        req.headers.set("x-username", payload.username as string);

      return await authorizeChannel(
        req,
        lobby,
        payload.userId as string,

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

    if (getRoute(req).startsWith("/prompt")) return req;

    try {
      const payload = await verifyToken(req, lobby);

      if (!payload || !payload?.userId || payload?.isUpload) {
        return unauthorized();
      }

      req.headers.set("x-user-id", payload.userId as string);

      if (payload?.username)
        req.headers.set("x-username", payload.username as string);

      return await authorizeChannel(
        req,
        lobby,
        payload.userId as string,
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
}
PageParty satisfies Party.Worker;
