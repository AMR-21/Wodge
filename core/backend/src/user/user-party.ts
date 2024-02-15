import type * as Party from "partykit/server";
import { Session, isSessionValid, ok, unauthorized } from "../utils";
import { handlePost } from "./user-party-post";

export default class UserParty implements Party.Server {
  constructor(readonly room: Party.Room) {}

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
        return await handlePost(req, this.room);
      default:
        return ok();
    }
  }

  static async onBeforeRequest(req: Party.Request) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    // Get target user id from url
    // req.url.pathname takes the form of ['', 'parties', 'user', 'userId']
    const userId = new URL(req.url).pathname.split("/")[3];

    try {
      if (!userId) throw new Error("No user id found");

      // Extract session and csrf tokens from Authorization header
      // authorization takes form of sessionToken$csrfToken
      // Can be removed if we managed to use cookies cross-domain
      const authTokens = req.headers.get("Authorization");

      if (!authTokens) throw new Error("No auth tokens found");

      // Split the tokens
      const [sessionToken, csrfToken] = authTokens.split("$");

      if (!sessionToken || !csrfToken)
        throw new Error("No session or csrf token found");

      // Fetch the session from the auth endpoint validated by the CSRF token
      // Cookies's name correspond to the ones set by auth.js
      const res = await fetch("http://localhost:3000/api/auth/session", {
        headers: {
          Accept: "application/json",
          Cookie: `authjs.session-token=${sessionToken}; authjs.csrf-token=${csrfToken};`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const session = (await res.json()) as Session;

      // Validate the session
      if (!session || !isSessionValid(session))
        throw new Error("Invalid Session");

      // Authorize the user
      if (session.userId !== userId) throw new Error("Unauthorized");

      return req;
    } catch (e) {
      return unauthorized();
    }
  }
}

UserParty satisfies Party.Worker;
