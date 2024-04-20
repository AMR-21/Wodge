import type * as Party from "partykit/server";
import { badRequest, getRoute } from "../lib/http-utils";
import ThreadParty from "./thread-party";
import { threadPush } from "./thread-push";
import { threadPull } from "./thread-pull";

export async function handlePost(req: Party.Request, party: ThreadParty) {
  const route = getRoute(req);

  switch (route) {
    case "/replicache-push":
      return threadPush(req, party);
    case "/replicache-pull":
      return threadPull(req, party);

    default:
      return badRequest();
  }
}
