/**
 * The purpose of this class to localize the user data
 * and keep it in sync
 * In the future it may support mutating user info like profile
 * locally
 */

import type * as Party from "partykit/server";

// import { handlePost } from "./endpoints/user-post";
import { getRoute, notImplemented, ok, unauthorized } from "../lib/http-utils";
import { getCurrentUser } from "../lib/auth";
import {
  PokeMessage,
  REPLICACHE_VERSIONS_KEY,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { UserPartyInterface, Versions } from "../types";
// import { handleGet } from "./endpoints/user-get";
import { Hono } from "hono";
import { userPull } from "./handlers/user-pull";
import { startFn } from "./start-fn";
import { userPush } from "./handlers/user-push";
import { addWorkspace } from "./handlers/add-workspace";
import { removeWorkspace } from "./handlers/remove-workspace";
import { poke } from "./handlers/poke";
import { getUserWorkspaces } from "./handlers/get-user-workspace";
import { update } from "./handlers/update";
import { uploadAvatar } from "./handlers/upload-avatar";
import { cors } from "hono/cors";
import { deleteAvatar } from "./handlers/delete-avatar";
import { serviceMiddleware } from "../lib/service-middleware";

export default class UserParty implements Party.Server, UserPartyInterface {
  options: Party.ServerOptions = {
    hibernate: true,
  };

  workspacesStore: Set<string>;
  versions: Versions;
  app: Hono = new Hono().basePath("/parties/user/:userId");

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    this.app.post("/replicache-pull", userPull.bind(null, this));
    this.app.post("/replicache-push", userPush.bind(null, this));

    this.app.use("/service/*", serviceMiddleware.bind(null, this.room));

    this.app.post("/service/add-workspace", addWorkspace.bind(null, this));

    this.app.post(
      "/service/remove-workspace",
      removeWorkspace.bind(null, this)
    );

    this.app.post("/service/poke", poke.bind(null, this));

    this.app.post("/update", update.bind(null, this));
    this.app
      .post("/avatar", uploadAvatar.bind(null, this))
      .delete(deleteAvatar.bind(null, this));

    this.app.get("/workspaces", getUserWorkspaces.bind(null, this));

    await startFn(this);
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

    if (connections === 0) {
      await this.handlePresence([...this.workspacesStore], false);
    }
  }

  async ensurePresence() {
    // Check if there were another connections, which means that the user is already registered
    const connections = [...this.room.getConnections()].length;

    if (connections > 1) {
      return;
    }

    await this.handlePresence([...this.workspacesStore]);
  }

  async handlePresence(wid: string | string[], connecting = true) {
    const WorkspaceParty = this.room.context.parties.workspace!;

    if (typeof wid === "string") {
      // Register to a specific workspace - on join

      const workspace = WorkspaceParty.get(wid);

      await workspace.fetch("/service/presence", {
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
          WorkspaceParty.get(id).fetch("/service/presence", {
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
    //@ts-ignore
    return this.app.fetch(req);
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }
    if (getRoute(req).startsWith("/service")) return req;

    try {
      const user = await getCurrentUser(req, lobby);

      // Authorize the user by checking that session.userId matches the target user id (party id)
      if (user.id !== lobby.id) throw new Error("Unauthorized");

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
      const user = await getCurrentUser(req, lobby);

      // Authorize the user by checking that session.userId matches the target user id (party id)
      if (user.id !== lobby.id) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }

  poke(data?: PokeMessage) {
    this.room.broadcast(JSON.stringify({ sub: "poke", ...data }));
  }
}
UserParty satisfies Party.Worker;
