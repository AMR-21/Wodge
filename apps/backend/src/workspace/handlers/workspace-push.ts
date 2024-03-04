import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { RunnerParams, repPush } from "../../lib/replicache";
import { badRequest, unauthorized } from "../../lib/http-utils";
import { WorkspaceSchema } from "@repo/data";
import { makeWorkspaceKey } from "@repo/data";

export async function workspacePush(req: Party.Request, party: WorkspaceParty) {
  const res = await repPush(
    req,
    party.room.storage,
    party.versions,
    runner(party)
  );

  if (res.status === 200) {
    await party.poke();
  }

  return res;
}

//verify room id
function runner(party: WorkspaceParty) {
  return async ({ mutation, nextVersion, userId }: RunnerParams) => {
    const { storage } = party.room;
    const { workspaceMembers, workspaceMetadata, workspaceStructure } = party;

    switch (mutation.name) {
      case "initWorkspace":
        // 1. validate that initiator of the request is the owner of the workspace
        if (workspaceMembers.data.owner !== userId) {
          return;
        }

        // 2. validate the mutation id is 1
        if (mutation.id !== 1) {
          return;
        }

        // 3. validate the data
        const validatedFields = WorkspaceSchema.safeParse(mutation.args);

        if (!validatedFields.success) {
          return;
        }

        const { data: workspaceData } = validatedFields;

        // Validate the target workspace
        if (workspaceData.id !== party.room.id) {
          return;
        }

        // 4. persist the data
        workspaceMetadata.data = workspaceData;
        workspaceMetadata.lastModifiedVersion = nextVersion;

        await storage.put(makeWorkspaceKey(party.room.id), workspaceMetadata);

        break;
      default:
        throw new Error("Unknown mutation: " + mutation.name);
    }
  };
}
