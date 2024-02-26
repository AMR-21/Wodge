/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

import { handlePost } from "./handlers/user-party-post";
import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { getSession } from "../lib/auth";
import { makeWorkspacesStoreKey } from "@repo/data/keys";
import { ServerWorkspacesStore, UserPartyInterface } from "../types";

export default class UserParty implements Party.Server, UserPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  workspacesStore: ServerWorkspacesStore;
  versions: Map<string, number>;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const map = await this.room.storage.get([
      "versions",
      makeWorkspacesStoreKey(),
    ]);

    this.versions = (map.get("versions") ||
      new Map([["globalVersion", 0]])) as typeof this.versions;

    this.workspacesStore = (map.get(makeWorkspacesStoreKey()) || {
      data: [],
      lastModifiedVersion: 0,
      deleted: false,
    }) as ServerWorkspacesStore;
  }

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return await handlePost(req, this);
      case "OPTIONS":
        return ok();
      default:
        return notImplemented();
    }
  }

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
}
UserParty satisfies Party.Worker;
