import { createWorkspace } from "../handlers/create-workspace";
import { joinWorkspace } from "../handlers/join-workspace";
import WorkspaceParty from "../workspace-party";

export function setupMembershipsRoutes(party: WorkspaceParty) {
  party.app.post("/create", createWorkspace.bind(null, party));
  party.app.post("/join", joinWorkspace.bind(null, party));
}
