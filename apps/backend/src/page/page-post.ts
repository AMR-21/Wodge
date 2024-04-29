import type * as Party from "partykit/server";
import PageParty from "./page-party";
import { badRequest, getRoute } from "../lib/http-utils";
import { prompt } from "./prompt";

export async function handlePost(req: Party.Request, party: PageParty) {
  const route = getRoute(req);
  switch (route) {
    case "/prompt":
      return await prompt(req, party);
    default:
      return badRequest();
  }
}
