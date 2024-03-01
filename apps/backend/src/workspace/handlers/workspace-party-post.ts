import type * as Party from "partykit/server";
import {
  badRequest,
  error,
  getRoute,
  ok,
  unauthorized,
} from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import { workspacePull } from "./workspace-pull";
import { workspacePush } from "./workspace-push";
import { makeWorkspaceMembersKey } from "@repo/data/keys";
import { PublicUserType } from "@repo/data/schemas";
import { createWorkspace } from "./create-workspace";

export async function handlePost(req: Party.Request, party: WorkspaceParty) {
  const route = getRoute(req);

  switch (route) {
    case "/replicache-push":
      return workspacePush(req, party);
    case "/replicache-pull":
      return workspacePull(req, party);
    case "/create":
      return createWorkspace(req, party);
    default:
      return badRequest();
  }
}
