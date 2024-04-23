import type * as Party from "partykit/server";
import { roomPull } from "./room-pull";
import { roomPush } from "./room-push";
import RoomParty from "./room-party";
import { badRequest, getRoute } from "../lib/http-utils";

export async function handlePost(req: Party.Request, party: RoomParty) {
  const route = getRoute(req);

  console.log(JSON.parse(req.headers.get("channel-auth")!));

  switch (route) {
    case "/replicache-push":
      return roomPush(req, party);
    case "/replicache-pull":
      return roomPull(req, party);

    default:
      return badRequest();
  }
}
