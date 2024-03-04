/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

import { handlePost } from "./endpoints/user-post";
import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { getSession } from "../lib/auth";
import {
  REPLICACHE_VERSIONS_KEY,
  USER_IS_CONNECTED_KEY,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { ServerWorkspacesStore, UserPartyInterface, Versions } from "../types";

export default class UserParty implements Party.Server, UserPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  workspacesStore: ServerWorkspacesStore;
  versions: Versions;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const map = await this.room.storage.get([
      REPLICACHE_VERSIONS_KEY,
      makeWorkspacesStoreKey(),
    ]);

    this.versions =
      <Versions>map.get(REPLICACHE_VERSIONS_KEY) ||
      new Map<string, number | boolean>([["globalVersion", 0]]);

    this.workspacesStore = <ServerWorkspacesStore>(
      map.get(makeWorkspacesStoreKey())
    ) || {
      data: [],
      lastModifiedVersion: 0,
      deleted: false,
    };
  }

  // When user is connected to the party
  // Connect the userDO to all workspaces by populating presence
  // even with multiple connections from same user (multi-device)
  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    await this.ensurePresence();

    connection.send(
      JSON.stringify({
        type: "welcome",
        msg: "Welcome to the party!",
      })
    );
  }

  async onClose() {
    const connections = [...this.room.getConnections()].length;

    if (connections === 0)
      await this.handlePresence(
        this.workspacesStore.data.map((ws) => ws.workspaceId, false)
      );
  }

  async ensurePresence() {
    // Check if there were another connections, which means that the user is already registered
    const connections = [...this.room.getConnections()].length;

    if (connections > 1) {
      return;
    }

    // Register the user in its workspaces
    const workspaceIds = this.workspacesStore.data
      .filter((ws) => ws.environment === "cloud")
      .map((ws) => ws.workspaceId);

    await this.handlePresence(workspaceIds);
  }

  async handlePresence(wid: string | string[], connecting = true) {
    const WorkspaceParty = this.room.context.parties.workspace!;

    if (typeof wid === "string") {
      // Register to a specific workspace - on join

      const workspace = WorkspaceParty.get(wid);

      await workspace.fetch("/presence", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: this.room.env.SERVICE_KEY as string,
        },
        body: JSON.stringify({
          userId: this.room.id,
          connect: connecting,
        }),
      });
    } else {
      // Register to all workspaces - on connect
      await Promise.all(
        wid.map((id) =>
          WorkspaceParty.get(id).fetch("/presence", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: this.room.env.SERVICE_KEY as string,
            },
            body: JSON.stringify({
              userId: this.room.id,
              connect: connecting,
            }),
          })
        )
      );
    }
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

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      // service key requests for updating user data in parties

      // Authorize the user by checking that session.userId matches the target user id (party id)
      if (session.userId !== lobby.id) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }

  poke() {
    this.room.broadcast("poke");
  }
}
UserParty satisfies Party.Worker;
