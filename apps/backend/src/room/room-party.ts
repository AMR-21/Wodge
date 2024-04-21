import type * as Party from "partykit/server";

import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authorizeChannel, getCurrentUser } from "../lib/auth";
import { RoomPartyInterface, ServerRoomMessages, Versions } from "../types";
import { handlePost } from "./room-post";
import { REPLICACHE_VERSIONS_KEY } from "@repo/data";

export default class RoomParty implements Party.Server, RoomPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  roomMessages: ServerRoomMessages;
  versions: Versions;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.roomMessages = (await this.room.storage.get("messages")) || {
      data: [],
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.versions = <Versions>(
      ((await this.room.storage.get(REPLICACHE_VERSIONS_KEY)) ||
        new Map<string, number | boolean>([["globalVersion", 0]]))
    );
  }

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
      const user = await getCurrentUser(req, lobby);
      return authorizeChannel(req, lobby, user.id, "room");
    } catch (e) {
      return unauthorized();
    }
  }
}
RoomParty satisfies Party.Worker;
