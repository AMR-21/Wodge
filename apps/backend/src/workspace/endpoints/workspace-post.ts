import type * as Party from "partykit/server";
import { badRequest, getRoute, ok } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import { workspacePull } from "../handlers/workspace-pull";
import { workspacePush } from "../handlers/workspace-push";
import { createWorkspace } from "../handlers/create-workspace";
import { createInvite } from "../handlers/create-invite";
import { joinWorkspace } from "../handlers/join-workspace";

export async function handlePost(req: Party.Request, party: WorkspaceParty) {
  const route = getRoute(req);

  switch (route) {
    case "/replicache-push":
      return workspacePush(req, party);
    case "/replicache-pull":
      return workspacePull(req, party);
    case "/create":
      return createWorkspace(req, party);
    case "/create-invite":
      return createInvite(req, party);
    case "/join":
      return joinWorkspace(req, party);
    default:
      return badRequest();
  }
}
