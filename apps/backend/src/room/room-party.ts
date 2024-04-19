import type * as Party from "partykit/server";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getSession } from "../lib/auth";
import { RoomPartyInterface, ServerRoomMessages, Versions } from "../types";
import { handlePost } from "./room-post";

export default class RoomParty implements Party.Server, RoomPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  roomMessages: ServerRoomMessages;
  versions: Versions;

  constructor(readonly room: Party.Room) {}

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return await handlePost(req, this);
      // case "GET":
      //   return await handleGet(req, this);
      case "OPTIONS":
        return ok();
      default:
        return notImplemented();
    }
    return ok();
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);
      return authorizeChannel(req, lobby, session.userId, "room");
    } catch (e) {
      return unauthorized();
    }
  }
}
RoomParty satisfies Party.Worker;
