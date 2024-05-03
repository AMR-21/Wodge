import type * as Party from "partykit/server";
import {
  getRoute,
  notFound,
  notImplemented,
  ok,
  unauthorized,
} from "../lib/http-utils";

import { authWorkspaceAccess, getCurrentUser } from "../lib/auth";

import {
  ServerWorkspaceMembers,
  WorkspacePartyInterface,
  ServerWorkspaceStructure,
  Versions,
  PresenceMap,
} from "../types";

import { Invites, ID_LENGTH, PokeMessage } from "@repo/data";
import { Hono } from "hono";
import { uploadFile } from "./handlers/upload-file";
import { startFn } from "./start-fn";
import { cors } from "hono/cors";
import { workspacePull } from "./handlers/workspace-pull";
import { createWorkspace } from "./handlers/create-workspace";
import { workspacePush } from "./handlers/workspace-push";
import { createInvite } from "./handlers/create-invite";
import { joinWorkspace } from "./handlers/join-workspace";
import { handlePresence } from "./handlers/presence";
import { updateWorkspace } from "./handlers/update-workspace";
import { channelPoke } from "./handlers/channel-poke";
import { leaveWorkspace } from "./handlers/leave-workspace";
import { deleteWorkspace } from "./handlers/delete-workspace";
import { getMembership } from "./handlers/get-membership";
import { getInvites } from "./handlers/get-invites";
import { getMembersInfo } from "./handlers/get-members-info";
import { authChannel } from "./handlers/auth-channel";
import { uploadAvatar } from "./handlers/upload-avatar";
import { deleteFile } from "./handlers/delete-file";
import { listFiles } from "./handlers/list-files";
import { downloadFile } from "./handlers/download-file";

export default class WorkspaceParty
  implements Party.Server, WorkspacePartyInterface
{
  workspaceMembers: ServerWorkspaceMembers;
  // workspaceMetadata: ServerWorkspaceData;
  workspaceStructure: ServerWorkspaceStructure;
  invites: Invites;
  versions: Versions;

  // Map to track the presence of users in the workspace
  // Number count the connected user devices - may use the user-agent header instead
  presenceMap: PresenceMap;

  app: Hono = new Hono().basePath("/parties/workspace/:workspaceId");

  constructor(readonly room: Party.Room) {}

  async onStart() {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    this.app.post("/replicache-pull", workspacePull.bind(null, this));

    this.app.post("/replicache-push", workspacePush.bind(null, this));

    this.app.post("/create", createWorkspace.bind(null, this));

    this.app.post("/create-invite", createInvite.bind(null, this));

    this.app.post("/join", joinWorkspace.bind(null, this));

    this.app.post("/presence", handlePresence.bind(null, this));

    this.app.post("/update", updateWorkspace.bind(null, this));

    this.app.post("/poke", channelPoke.bind(null, this));

    this.app.post("/leave", leaveWorkspace.bind(null, this));

    this.app
      .get("/files/:teamId/:path?", listFiles.bind(null, this))
      .post(uploadFile.bind(null, this))
      .delete(deleteFile.bind(null, this, "file"));

    this.app.get("/file/:teamId/:path", downloadFile.bind(null, this));

    this.app
      .post("/avatar", uploadAvatar.bind(null, this))
      .delete(deleteFile.bind(null, this, "avatar"));

    this.app.delete("/", deleteWorkspace.bind(null, this));

    this.app.get("/membership", getMembership.bind(null, this));

    this.app.get("/invites", getInvites.bind(null, this));

    this.app.get("/members-info", getMembersInfo.bind(null, this));

    this.app.get("/auth-channel", authChannel.bind(null, this));

    await startFn(this);
  }

  async onRequest(req: Party.Request) {
    // @ts-ignore
    return this.app.fetch(req);

    // switch (req.method) {
    //   case "POST":
    //     return await handlePost(req, this);
    //   case "OPTIONS":
    //     return ok();
    //   case "GET":
    //     return await handleGet(req, this);
    //   case "PATCH":
    //     this.poke();
    //     return ok();
    //   default:
    //     return notImplemented();
    // }
  }

  static async onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
    return notImplemented();
  }

  static async onBeforeRequest(req: Party.Request, lobby: Party.Lobby) {
    if (lobby.id.length !== ID_LENGTH) return notFound();

    // CORS preflight response
    if (req.method === "OPTIONS") {
      return ok();
    }

    if (getRoute(req) === "/auth-channel") return req;

    try {
      // maybe removed when bindings are supported
      const user = await getCurrentUser(req, lobby);
      if (!user) return unauthorized();

      const route = getRoute(req);
      // Check if the request is to create or join the workspace then put user data in the headers
      if (route === "/create" || route === "/join") {
        return req;
      }

      // Check if the user is authorized to access the workspace
      // i.e. is member of the workspace
      if (!authWorkspaceAccess(req, lobby)) return unauthorized();

      // Request is authorized - forward it
      return req;
    } catch (e) {
      return unauthorized();
    }
  }

  async poke(
    { type, id, userId }: WorkspacePokeProps = {
      type: "workspace",
    }
  ) {
    const userParty = this.room.context.parties.user!;

    if (userId) {
      return await userParty.get(userId).fetch("/poke", {
        method: "POST",
        headers: {
          authorization: this.room.env.SERVICE_KEY as string,
        },
        body: JSON.stringify({
          type,
          id: id || this.room.id,
        }),
      });
    }

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

interface WorkspacePokeProps {
  type: PokeMessage["type"];
  id?: string;
  userId?: string;
}
