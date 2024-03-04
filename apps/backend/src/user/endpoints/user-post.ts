import type * as Party from "partykit/server";
import {
  badRequest,
  getRoute,
  json,
  notChanged,
  ok,
} from "../../lib/http-utils";
import {
  REPLICACHE_VERSIONS_KEY,
  UserSchema,
  UserType,
  makeWorkspacesStoreKey,
} from "@repo/data";
import UserParty from "../user-party";
import { userPush } from "../handlers/user-push";
import { userPull } from "../handlers/user-pull";

export async function handlePost(req: Party.Request, party: UserParty) {
  const route = getRoute(req);
  switch (route) {
    case "/replicache-push":
      return userPush(req, party);
    case "/replicache-pull":
      return userPull(req, party);

    case "/add-workspace":
      const { workspaceId } = <
        {
          workspaceId: string;
        }
      >await req.json();

      if (!workspaceId) return badRequest();

      // Update store and versions
      const nextVersion = (party.versions.get("globalVersion") as number) + 1;

      party.versions.set("globalVersion", nextVersion);

      party.workspacesStore.data.push({
        workspaceId,
        environment: "cloud",
      });

      party.workspacesStore.lastModifiedVersion = nextVersion;

      // Persist data
      await party.room.storage.put({
        [makeWorkspacesStoreKey()]: party.workspacesStore,
        [REPLICACHE_VERSIONS_KEY]: party.versions,
      });

      party.poke();
      return ok();

    default:
      return badRequest();
  }
}
