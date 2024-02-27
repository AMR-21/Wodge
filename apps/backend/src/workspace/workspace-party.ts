import type * as Party from "partykit/server";
import {
  getRoute,
  json,
  notImplemented,
  ok,
  unauthorized,
} from "../lib/http-utils";
import { getSession } from "../lib/auth";
import {
  ServerWorkspaceMembers,
  ServerWorkspaceData,
  WorkspacePartyInterface,
  ServerWorkspaceStructure,
  Versions,
} from "../types";
import { handlePost } from "./handlers/workspace-party-post";
import {
  REPLICACHE_VERSIONS_KEY,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data/keys";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  workspaceMembers: ServerWorkspaceMembers;
  workspaceMetadata: ServerWorkspaceData;
  workspaceStructure: ServerWorkspaceStructure;
  versions: Versions;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const membersKey = makeWorkspaceMembersKey();
    const metadataKey = makeWorkspaceKey(this.room.id);
    const structureKey = makeWorkspaceStructureKey();

    const map = await this.room.storage.get([
      membersKey,
      metadataKey,
      structureKey,
      REPLICACHE_VERSIONS_KEY,
    ]);

    this.workspaceMembers = <ServerWorkspaceMembers>map.get(membersKey) || {
      data: {
        owner: "",
        members: [],
      },
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.workspaceMetadata = <ServerWorkspaceData>map.get(metadataKey) || {
      data: {},
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.workspaceStructure = <ServerWorkspaceStructure>(
      map.get(structureKey)
    ) || {
      data: {},
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.versions =
      <Versions>map.get(REPLICACHE_VERSIONS_KEY) ||
      new Map([["globalVersion", 0]]);
  }

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return await handlePost(req, this);
      case "OPTIONS":
        return ok();
      case "GET":
        console.log(this.workspaceMembers);
        return json({
          global: this.versions,
          workspaceMembers: this.workspaceMembers,
          workspaceMetadata: this.workspaceMetadata,
          workspaceStructure: this.workspaceStructure,
        });
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

      // Check if the request is to create the workspace then put user data in the headers
      if (getRoute(req) === "/create") {
        req.headers.set("x-user-data", JSON.stringify(session.user));
        return req;
      }

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }
  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {}
}
