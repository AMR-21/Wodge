import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}
}

Server satisfies Party.Worker;
