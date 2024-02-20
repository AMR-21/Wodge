import { Request } from "partykit/server";
import UserParty from "../user-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { NewWorkspaceSchema } from "@repo/data/schemas";

export async function userPush(req: Request, party: UserParty) {
  return await repPush(req, party.room.storage, party.versions, runner(party));
}

function runner(party: UserParty) {
  return async ({ mutation, nextVersion, storage }: RunnerParams) => {
    switch (mutation.name) {
      case "createSpace":
        const validatedFields = NewWorkspaceSchema.safeParse(mutation.args);

        // Skip invalid mutations
        // Most likely user skipped client side validation
        if (!validatedFields.success) return;

        // TODO check that the space doesn't already exist by checking that the context has no spaces with the same id

        const { data } = validatedFields;

        // Space already exists
        if (party.spaceStore.spaces[data.id]) {
          return;
        }

        // Default roles for the owner
        party.spaceStore.spaces[data.id] = ["owner", "member"];
        party.spaceStore.lastModifiedVersion = nextVersion;

        // Update the user's space store
        await storage.put("spaces", party.spaceStore);

        // TODO populate the space with its new info
        break;
      case "joinSpace":
        // Todo
        break;
      default:
        throw new Error("Unknown mutation: " + mutation.name);
    }
  };
}
