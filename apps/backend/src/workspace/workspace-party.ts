import type * as Party from "partykit/server";
import {
  getRoute,
  json,
  notImplemented,
  ok,
  unauthorized,
} from "../lib/http-utils";

import { checkMembership, getSession } from "../lib/auth";

import {
  ServerWorkspaceMembers,
  ServerWorkspaceData,
  WorkspacePartyInterface,
  ServerWorkspaceStructure,
  Versions,
} from "../types";

import { handlePost } from "./endpoints/workspace-post";

import {
  REPLICACHE_VERSIONS_KEY,
  WORKSPACE_INVITE_LINK_KEY,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
  defaultWorkspaceMembers,
  InviteLink,
} from "@repo/data";
import { handleGet } from "./endpoints/workspace-get";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  workspaceMembers: ServerWorkspaceMembers;
  workspaceMetadata: ServerWorkspaceData;
  workspaceStructure: ServerWorkspaceStructure;
  inviteLink: InviteLink;
  // emailInvites: InviteLink[];
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
      WORKSPACE_INVITE_LINK_KEY,
      REPLICACHE_VERSIONS_KEY,
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
      data: {},
      lastModifiedVersion: 0,
      deleted: false,
    };

    this.versions =
      <Versions>map.get(REPLICACHE_VERSIONS_KEY) ||
      new Map([["globalVersion", 0]]);

    this.inviteLink = <InviteLink>map.get(WORKSPACE_INVITE_LINK_KEY) || {};
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
    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    try {
      const session = await getSession(req, lobby);

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace
      const isMember = await checkMembership(session.userId, lobby);

      if (!isMember) throw new Error("Unauthorized");

      console.log(
        `User ${session.user.username} is connected to workspace ${lobby.id}`
      );
      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
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
      if (route === "/create" || route === "/join") {
        req.headers.set("x-user-data", JSON.stringify(session.user));
        return req;
      }

      // skip membership check for join request
      if (route === "/join") return req;

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace
      const isMember = await checkMembership(session.userId, lobby);

      if (!isMember) throw new Error("Unauthorized");

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }

  poke() {
    this.room.broadcast("poke");
  }
}
WorkspaceParty satisfies Party.Worker;
