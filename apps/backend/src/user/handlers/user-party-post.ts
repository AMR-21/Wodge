import type * as Party from "partykit/server";
import { badRequest, getRoute, json, notChanged } from "../../lib/http-utils";
import { UserSchema, UserType } from "@repo/data/schemas";
import UserParty from "../user-party";
import { userPush } from "./user-push";
import { userPull } from "./user-pull";

export async function handlePost(req: Party.Request, party: UserParty) {
  const route = getRoute(req);
  switch (route) {
    case "/replicache-push":
      return userPush(req, party);
    case "/replicache-pull":
      return userPull(req, party);

    default:
      return badRequest();
  }
}
