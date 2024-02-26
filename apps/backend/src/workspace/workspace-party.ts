import type * as Party from "partykit/server";
import { notImplemented, ok, unauthorized } from "../lib/http-utils";
import { getSession } from "../lib/auth";
import {
  ServerWorkspaceMembers,
  ServerWorkspaceData,
  WorkspacePartyInterface,
  ServerWorkspaceStructure,
} from "../types";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  workspaceMembers: ServerWorkspaceMembers;
  workspaceMetadata: ServerWorkspaceData;
  workspaceStructure: ServerWorkspaceStructure;
  versions: Map<string, number>;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    // this.versions =
    //   (await this.room.storage.get("versions")) ||
    //   new Map([["globalVersion", 0]]);
  }

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return ok();
      case "OPTIONS":
        return ok();
      case "GET":
        return ok();
      default:
        return notImplemented();
    }
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace
      console.log({ session });
      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }
  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {}
}
