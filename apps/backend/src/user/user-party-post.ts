import type * as Party from "partykit/server";
import { badRequest, getRoute, json, notChanged } from "../lib/http-utils";
import { UserSchema, UserType } from "@repo/data/schemas";
import { populate } from "./handlers/populate";
import UserParty from "./user-party";
import { userPush } from "./handlers/user-push";
import { userPull } from "./handlers/user-pull";

export async function handlePost(req: Party.Request, party: UserParty) {
  const route = getRoute(req);
  switch (route) {
    case "/populate":
      return populate(req, party);
    case "/replicache-push":
      return userPush(req, party);
    case "/replicache-pull":
      return userPull(req, party);

    default:
      return badRequest();
  }
}
