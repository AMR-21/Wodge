import { Request } from "partykit/server";
import UserParty from "../user-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { NewWorkspaceSchema } from "@repo/data";
import { makeWorkspacesStoreKey } from "@repo/data";

export async function userPush(req: Request, party: UserParty) {
  const res = await repPush(
    req,
    party.room.storage,
    party.versions,
    runner(party)
  );

  if (res.status === 200) {
    party.poke();
  }

  return res;
}

function runner(party: UserParty) {
  return async ({ mutation, nextVersion }: RunnerParams) => {
    const { storage } = party.room;
    const { workspacesStore } = party;
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

        if (
          workspacesStore &&
          workspacesStore.data.some((ws) => ws.workspaceId === data.id)
        ) {
          throw new Error("Workspace already exists");
        }

        workspacesStore.data.push({
          workspaceId: data.id,
          environment: data.onCloud ? "cloud" : "local",
        });

        workspacesStore.lastModifiedVersion = nextVersion;

        await storage.put(makeWorkspacesStoreKey(), workspacesStore);

        // Announce presence
        if (data.onCloud) await party.handlePresence(data.id);

        break;
      default:
        throw new Error("Unknown mutation: " + mutation.name);
    }
  };
}
