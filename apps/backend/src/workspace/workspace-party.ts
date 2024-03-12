import type * as Party from "partykit/server";
import { getRoute, notImplemented, ok, unauthorized } from "../lib/http-utils";

import { checkMembershipEdge, getSession } from "../lib/auth";

import {
  ServerWorkspaceMembers,
  ServerWorkspaceData,
  WorkspacePartyInterface,
  ServerWorkspaceStructure,
  Versions,
  PresenceMap,
} from "../types";

import { handlePost } from "./endpoints/workspace-post";

import {
  REPLICACHE_VERSIONS_KEY,
  WORKSPACE_INVITES_KEY,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
  defaultWorkspaceMembers,
  Invite,
  WORKSPACE_PRESENCE_KEY,
  Invites,
  defaultWorkspaceStructure,
} from "@repo/data";
import { handleGet } from "./endpoints/workspace-get";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  workspaceMembers: ServerWorkspaceMembers;
  workspaceMetadata: ServerWorkspaceData;
  workspaceStructure: ServerWorkspaceStructure;
  invites: Invites;
  versions: Versions;

  // Map to track the presence of users in the workspace
  // Number count the connected user devices - may use the user-agent header instead
  presenceMap: PresenceMap;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const membersKey = makeWorkspaceMembersKey();
    const metadataKey = makeWorkspaceKey();
    const structureKey = makeWorkspaceStructureKey();

    const map = await this.room.storage.get([
      membersKey,
      metadataKey,
      structureKey,
      WORKSPACE_INVITES_KEY,
      REPLICACHE_VERSIONS_KEY,
      WORKSPACE_PRESENCE_KEY,
    ]);

    this.workspaceMembers = <ServerWorkspaceMembers>map.get(membersKey) || {
      data: { ...defaultWorkspaceMembers() },
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
      data: { ...defaultWorkspaceStructure() },
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.versions =
      <Versions>map.get(REPLICACHE_VERSIONS_KEY) ||
      new Map([["globalVersion", 0]]);

    // remove
    this.invites = <Invites>map.get(WORKSPACE_INVITES_KEY) || new Map();

    this.presenceMap =
      <PresenceMap>map.get(WORKSPACE_PRESENCE_KEY) || new Map();
  }

  async onRequest(req: Party.Request) {
    switch (req.method) {
      case "POST":
        return await handlePost(req, this);
      case "OPTIONS":
        return ok();
      case "GET":
        return await handleGet(req, this);
      case "PATCH":
        this.poke();
        return ok();
      default:
        return notImplemented();
    }
  }

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    return notImplemented();
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      const route = getRoute(req);
      // Check if the request is to create or join the workspace then put user data in the headers
      if (route === "/create") {
        // req.headers.set("x-user-data", JSON.stringify(session.user));
        return req;
      }

      // skip membership check for join request
      if (route === "/join") return req;

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace
      const isMember = await checkMembershipEdge(session.userId, lobby);

      if (!isMember) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }

  async poke(type = "workspace", id = this.room.id) {
    const userParty = this.room.context.parties.user!;

    await Promise.all(
      Object.keys(Object.fromEntries(this.presenceMap)).map((userId) => {
        return userParty.get(userId).fetch("/poke", {
          method: "POST",
          headers: {
            authorization: this.room.env.SERVICE_KEY as string,
          },
          body: JSON.stringify({
            type,
            id: id || this.room.id,
          }),
        });
      })
    );
  }
}

WorkspaceParty satisfies Party.Worker;
