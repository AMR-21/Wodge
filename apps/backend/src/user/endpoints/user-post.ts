import type * as Party from "partykit/server";
import {
  badRequest,
  getRoute,
  json,
  notChanged,
  ok,
} from "../../lib/http-utils";
import {
  REPLICACHE_VERSIONS_KEY,
  UserSchema,
  UserType,
  makeWorkspacesStoreKey,
} from "@repo/data";
import UserParty from "../user-party";
import { userPush } from "../handlers/user-push";
import { userPull } from "../handlers/user-pull";
import { addWorkspace } from "../handlers/add-workspace";
import { poke } from "../handlers/poke";

export async function handlePost(req: Party.Request, party: UserParty) {
  const route = getRoute(req);
  switch (route) {
    case "/replicache-push":
      return userPush(req, party);
    case "/replicache-pull":
      return userPull(req, party);
    case "/add-workspace":
      return await addWorkspace(req, party);
    case "/create-workspace":

    case "/poke":
      return await poke(req, party);
    default:
      return badRequest();
  }
}
