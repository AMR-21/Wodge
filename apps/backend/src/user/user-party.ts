/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

import { handlePost } from "./handlers/user-party-post";
import { json, notImplemented, ok, unauthorized } from "../lib/http-utils";
import { authenticate } from "../lib/auth";
import { UserWorkspacesStore } from "@repo/data/schemas/user-schemas";
import { USER_WORKSPACES_STORE_KEY } from "@repo/data/keys";
import { UserPartyInterface } from "../types";

export default class UserParty implements Party.Server, UserPartyInterface {
  workspacesStore: UserWorkspacesStore;
  versions: Map<string, number>;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.versions =
      (await this.room.storage.get("versions")) ||
      new Map([["globalVersion", 0]]);

    this.workspacesStore = (await this.room.storage.get<UserWorkspacesStore>(
      USER_WORKSPACES_STORE_KEY
    )) || {
      workspaces: [],
      lastModifiedVersion: 0,
      deleted: false,
    };
  }

  async onRequest(req: Party.Request) {
    // Authorize user
    const userId = req.headers.get("x-user-id");

    if (!userId || userId !== this.room.id) {
      return unauthorized();
    }

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
    return await authenticate(req, lobby);
  }
}
UserParty satisfies Party.Worker;
