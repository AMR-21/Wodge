import { Request } from "partykit/server";
import UserParty from "../user-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { NewWorkspaceSchema } from "@repo/data/schemas";
import { USER_WORKSPACES_STORE_KEY } from "@repo/data/keys";

export async function userPush(req: Request, party: UserParty) {
  return await repPush(req, party.room.storage, party.versions, runner(party));
}

function runner(party: UserParty) {
  return async ({ mutation, nextVersion, storage }: RunnerParams) => {
    switch (mutation.name) {
      case "createWorkspace":
        const validatedFields = NewWorkspaceSchema.safeParse(mutation.args);

        // Skip invalid mutations
        // Most likely user skipped client side validation
        if (!validatedFields.success) return;

        // TODO check that the space doesn't already exist by checking that the context has no spaces with the same id
        // Simply use the workspace members data as source of truth
        // This only possible if the client did not create a space using truly random id - also its creation will be blocked
        // by space do owner validation scheme and is_verified flag so we may not need to check for this

        const { data } = validatedFields;

        // Space already exists on user store
        if (party.workspacesStore.workspaces.includes(data.id)) {
          return;
        }

        // Update the user's space store
        party.workspacesStore.workspaces.push(data.id);
        party.workspacesStore.lastModifiedVersion = nextVersion;

        await storage.put(USER_WORKSPACES_STORE_KEY, party.workspacesStore);

        break;
      default:
        throw new Error("Unknown mutation: " + mutation.name);
    }
  };
}
