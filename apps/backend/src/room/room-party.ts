import type * as Party from "partykit/server";

import { ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getCurrentUser } from "../lib/auth";
import { RoomPartyInterface, ServerRoomMessages, Versions } from "../types";
import { Hono } from "hono";
import { startFn } from "./start-fn";
import { roomPush } from "./room-push";
import { roomPull } from "./room-pull";
import { generateCallToken } from "./generate-call-token";

export default class RoomParty implements Party.Server, RoomPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  roomMessages: ServerRoomMessages;
  versions: Versions;

  app: Hono = new Hono().basePath("/parties/room/:roomId");

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.app.post("/replicache-push", roomPush.bind(null, this));
    this.app.post("/replicache-pull", roomPull.bind(null, this));

    this.app.get("/call-token", generateCallToken.bind(null, this));

    await startFn(this);
  }

  async onRequest(req: Party.Request) {
    //@ts-ignore
    return this.app.fetch(req);
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const user = await getCurrentUser(req, lobby);
      return authorizeChannel(req, lobby, user.id, "room");
    } catch (e) {
      return unauthorized();
    }
  }
}
RoomParty satisfies Party.Worker;
