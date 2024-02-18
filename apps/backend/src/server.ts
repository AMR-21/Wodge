import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // static async onBeforeRequest(req: Party.Request) {
  //   // console.log(req);
  //   // req.
  //   return req;
  // }
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
    // req.cf;

    // console.log(req);
    const cookie = req.headers.get("cookie");
    console.log({ req });

    return new Response("Hello from server NO", {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST",
      },
    });

    // const res = await fetch("http://localhost:3000/api/auth/session", {
    //   headers: {
    //     Accept: "application/json",
    //     Cookie: cookie,
    //   },
    // });

    // const session = await res.json();

    // return Response.json(session, {
    //   headers: {
    //     "Access-Control-Allow-Origin": "http://localhost:3000",
    //     "Access-Control-Allow-Credentials": "true",
    //     "Access-Control-Allow-Methods": "GET, POST",
    //   },
    // });
  }
}

Server satisfies Party.Worker;
