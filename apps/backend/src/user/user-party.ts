/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

import { handlePost } from "./handlers/user-party-post";
import { json, notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authenticate, getSession } from "../lib/auth";
import { UserWorkspacesStore } from "@repo/data/schemas/user-schemas";
import { USER_WORKSPACES_STORE_KEY } from "@repo/data/keys";
import { ServerWorkspacesStore, UserPartyInterface } from "../types";

export default class UserParty implements Party.Server, UserPartyInterface {
  workspacesStore: ServerWorkspacesStore;
  versions: Map<string, number>;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.versions =
      (await this.room.storage.get("versions")) ||
      new Map([["globalVersion", 0]]);

    this.workspacesStore = (await this.room.storage.get<ServerWorkspacesStore>(
      USER_WORKSPACES_STORE_KEY
    )) || {
      data: [],
      lastModifiedVersion: 0,
      deleted: false,
    };
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
