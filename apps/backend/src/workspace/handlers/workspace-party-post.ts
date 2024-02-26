import type * as Party from "partykit/server";
import { badRequest, getRoute } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import { workspacePull } from "./workspace-pull";
import { workspacePush } from "./workspace-push";

export async function handlePost(req: Party.Request, party: WorkspaceParty) {
  const route = getRoute(req);
  switch (route) {
    case "/replicache-push":
      return workspacePull(req, party);
    case "/replicache-pull":
      return workspacePush(req, party);
    case "/replicache-push-create":
      break;
    default:
      return badRequest();
  }
}
