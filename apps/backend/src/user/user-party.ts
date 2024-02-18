import type * as Party from "partykit/server";

import { handlePost } from "./user-party-post";
import {
  getPartyId,
  json,
  notImplemented,
  ok,
  unauthorized,
} from "../lib/http-utils";
import { getSession } from "../lib/auth";

export default class UserParty implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // User version object
  versions: Map<string, number> = new Map();

  async onStart() {
    this.versions =
      (await this.room.storage.get("versions")) ??
      new Map([["globalVersion", 0]]);
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return await handlePost(req, this);
      case "GET":
        return json({
          glob: this.versions.get("globalVersion"),
        });
      case "OPTIONS":
        return ok();
      default:
        return notImplemented();
    }
  }

  static async onBeforeRequest(req: Party.Request) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const userId = getPartyId(req);
      if (!userId) throw new Error("No user id found");

      const session = await getSession(req);

      // Authorize the user by checking that session.userId matches the target user id (party id)
      if (session.userId !== userId) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }
}
UserParty satisfies Party.Worker;
