import { Request } from "partykit/server";
import UserParty from "../user-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { UserType } from "@repo/data/schemas";
import { USER_PREFIX } from "@repo/data/prefixes";

export async function userPush(req: Request, party: UserParty) {
  return await repPush(req, party.room.storage, party.versions, runner);
}

async function runner({ mutation, nextVersion, storage }: RunnerParams) {
  switch (mutation.name) {
    case "updateUser":
      const user = mutation.args as UserType;

      await storage.put(USER_PREFIX + user.id, {
        ...user,
        version: nextVersion,
      });
      break;

    default:
      throw new Error("Unknown mutation: " + mutation.name);
  }
}
