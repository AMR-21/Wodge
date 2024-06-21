import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection) {}

  static async onFetch(
    req: Party.Request,
    lobby: Party.FetchLobby,
    ctx: Party.ExecutionContext
  ) {
    return new Response("Hello, from Wodge " + lobby.env.APP_DOMAIN, {
      status: 200,
    });
  }
}

Server satisfies Party.Worker;
