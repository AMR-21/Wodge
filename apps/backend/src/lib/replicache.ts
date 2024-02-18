import { Request, Storage } from "partykit/server";
import { CLIENT_GROUP_PREFIX, CLIENT_PREFIX } from "@repo/data/prefixes";
import { badRequest, error, json, ok, unauthorized } from "./http-utils";
import { PatchOperation, PullResponse } from "replicache";
import { z } from "zod";

export interface RunnerParams {
  mutation: {
    id: number;
    clientID: string;
    name: string;
    args?: any;
  };
  nextVersion: number;
  storage: Storage;
}

export async function repPull(
  req: Request,
  storage: Storage,
  versions: Map<string, number>,
  patcher: (keys: string[], storage: Storage) => Promise<PatchOperation[]>
) {
  const userId = "L-LrwqIbUxx0qBu5KS3eF";
  if (!userId) return unauthorized();

  const data = await req.json();
  const validatedData = PullRequestSchema.safeParse(data);

  if (!validatedData.success) {
    return badRequest();
  }
  const {
    data: { cookie, clientGroupID: clientGroupId },
  } = validatedData;

  const clientGroup = await getClientGroup(clientGroupId, userId, storage);
  const fromVersion = cookie ?? 0;
  const globalVersion = versions.get("globalVersion")!;

  const lastMutationIDChanges: Record<string, number> = {};

  // Get last mutations ids for clients in current client group
  [
    ...(
      await storage.list<ReplicacheClient>({
        prefix: `${CLIENT_GROUP_PREFIX}${clientGroupId}:${CLIENT_PREFIX}`,
      })
    ).values(),
  ].forEach((c) => (lastMutationIDChanges[c.id] = c.lastMutationID));

  // Get modified entries
  const changedEntriesKeys: string[] = [];

  [...versions.entries()].forEach(([k, v]) => {
    if (v > fromVersion) changedEntriesKeys.push(k);
  });

  // Get the operations
  const patch = await patcher(changedEntriesKeys, storage);

  return json(
    {
      lastMutationIDChanges,
      cookie: globalVersion,
      patch,
    } satisfies PullResponse,
    200
  );
}

const authError = {};
const clientStateNotFoundError = {};

export async function repPush(
  req: Request,
  storage: Storage,
  versions: Map<string, number>,
  runner: ({ mutation, nextVersion, storage }: RunnerParams) => Promise<void>
) {
  const userId = "L-LrwqIbUxx0qBu5KS3eF";
  const data = await req.json();

  if (!userId) return unauthorized();

  const validatedData = PushRequestSchema.safeParse(data);
  if (!validatedData.success) {
    return badRequest();
  }

  const {
    data: { mutations, clientGroupID },
  } = validatedData;

  // hashMap to avoid many reads
  const clients: Record<string, ReplicacheClient> = {};

  try {
    // Step 1 and 2: Get/Create client group and verify that the user owns it
    const clientGroup = await getClientGroup(clientGroupID, userId, storage);

    const globalVersion = versions.get("globalVersion")!;
    const nextVersion = globalVersion + 1;

    mutations.forEach(async (mutation, i) => {
      const { id, clientID } = mutation;

      // Step 3 and 4: Get/Create client and verify that it belongs to the client group
      let client = clients[clientID];

      if (!client) {
        client = await getClient(
          clientID,
          clientGroup.id,
          nextVersion,
          id,
          storage
        );

        clients[clientID] = client;
      }

      // Step 5: Verify that the mutation id is the next expected mutation id from user
      const expectedMutationID = client.lastMutationID + 1;

      // This means mutation already processed - skip the mutation
      // equivalent to continue;
      if (id < expectedMutationID) return;

      // A mutation from the future
      if (id > expectedMutationID) throw new Error("Mutation from the future");

      // Step 6: Run the mutation
      await runner({ mutation, nextVersion, storage });

      client.lastMutationID = expectedMutationID;
      client.lastModifiedVersion = nextVersion;
    });

    versions.set("globalVersion", nextVersion);

    await storage.put({ versions, ...clients });

    return ok();
  } catch (e) {
    switch (e) {
      case authError:
        return unauthorized();
      case clientStateNotFoundError:
        return json({ error: "ClientStateNotFound" }, 200);
      default:
        return error("Internal server error");
    }
  }
}

// BUG: Needs optimizations
async function getClient(
  id: string,
  clientGroupID: string,
  lastModifiedVersion: number,
  mutationId: number,
  storage: Storage
) {
  const key = CLIENT_GROUP_PREFIX + clientGroupID + ":" + CLIENT_PREFIX + id;
  const client = await storage.get<ReplicacheClient>(key);

  // If client exists, check if it belongs to the client group and returns it if it does
  if (client) {
    if (client.clientGroupID !== clientGroupID) throw authError;

    return client;
  }

  // If mutationID isn't 1, then this isn't a new client. We should have found
  // the client record.
  if (mutationId !== 1) throw clientStateNotFoundError;

  // Client does not exist, create it and return it
  await storage.put(key, {
    id,
    clientGroupID: clientGroupID,
    lastMutationID: 0,
    lastModifiedVersion,
  });

  return { id, clientGroupID, lastMutationID: 0, lastModifiedVersion };
}

async function getClientGroup(
  clientGroupId: string,
  userId: string,
  storage: Storage
) {
  // Check for existent client group
  const clientGroup = await storage.get<ReplicacheClientGroup>(
    CLIENT_GROUP_PREFIX + clientGroupId
  );

  // If client group exists, check if it belongs to the user and returns it if it does
  if (clientGroup) {
    if (clientGroup.userID !== userId) throw authError;

    return clientGroup;
  }

  // Client group does not exist, create it and return it
  await storage.put(CLIENT_GROUP_PREFIX + clientGroupId, {
    id: clientGroupId,
    userID: userId,
  });

  return { id: clientGroupId, userID: userId };
}

export type ReplicacheSpace = {
  id: string;
  version: number;
};

export type ReplicacheClientGroup = {
  id: string;
  userID: string;
  clientVersion: number;
};

export type ReplicacheClient = {
  id: string;
  clientGroupID: string;
  lastMutationID: number;
  lastModifiedVersion: number;
};

export const MutationSchema = z.object({
  id: z.number(),
  clientID: z.string(),
  name: z.string(),
  args: z.any(),
});

export const PushRequestSchema = z.object({
  clientGroupID: z.string(),
  mutations: z.array(MutationSchema),
});

export type PushRequest = z.infer<typeof PushRequestSchema>;

export const PullRequestSchema = z.object({
  clientGroupID: z.string(),
  cookie: z.union([z.number(), z.null()]),
});

export type PullRequest = z.infer<typeof PullRequestSchema>;
