import { Request, Storage } from "partykit/server";
import {
  JOINER,
  REPLICACHE_CLIENT_GROUP_PREFIX,
  REPLICACHE_CLIENT_PREFIX,
  extractClientId,
  makeClientGroupKey,
  makeClientKey,
} from "@repo/data/prefixes";
import { badRequest, error, json, ok, unauthorized } from "./http-utils";
import { PatchOperation, PullResponse } from "replicache";
import { z } from "zod";

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

const authError = {};
const clientStateNotFoundError = {};

export async function repPull(
  req: Request,
  storage: Storage,
  versions: Map<string, number>,
  patcher: (
    fromVersion: number,
    storage: Storage,
    versions: Map<string, number>
  ) => Promise<PatchOperation[]>
) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  const data = await req.json();
  const validatedData = PullRequestSchema.safeParse(data);

  if (!validatedData.success) {
    return badRequest();
  }

  try {
    const {
      data: { cookie, clientGroupID: clientGroupId },
    } = validatedData;

    const c = await getClientGroup(clientGroupId, userId, storage, false);
    const fromVersion = cookie ?? 0;
    const globalVersion = versions.get("globalVersion")!;

    const lastMutationIDChanges: Record<string, number> = {};

    // Get last mutations ids for clients in current client group
    [
      ...(
        await storage.list<ReplicacheClient>({
          prefix: `${REPLICACHE_CLIENT_GROUP_PREFIX}${clientGroupId}${JOINER}${REPLICACHE_CLIENT_PREFIX}`,
        })
      ).values(),
    ].forEach((c) => {
      if (c.lastModifiedVersion > fromVersion)
        lastMutationIDChanges[extractClientId(c.id)!] = c.lastMutationID;
    });

    // Get the operations
    const patch = await patcher(fromVersion, storage, versions);

    return json(
      {
        lastMutationIDChanges,
        cookie: globalVersion,
        patch,
      } satisfies PullResponse,
      200
    );
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

export async function repPush(
  req: Request,
  storage: Storage,
  versions: Map<string, number>,
  runner: ({ mutation, nextVersion, storage }: RunnerParams) => Promise<void>,
  poker?: () => Promise<void>
) {
  const userId = req.headers.get("x-user-id");
  const data = await req.json();

  if (!userId) return unauthorized();

  const validatedData = PushRequestSchema.safeParse(data);
  if (!validatedData.success) {
    return badRequest();
  }

  const {
    data: { mutations, clientGroupID },
  } = validatedData;

  try {
    // Step 1 and 2: Get/Create client group and verify that the user owns it
    const clientGroup = await getClientGroup(clientGroupID, userId, storage);

    if (!clientGroup) throw new Error("Client group not found");

    const globalVersion = versions.get("globalVersion")!;
    const nextVersion = globalVersion + 1;
    // hashMap to avoid many reads

    const clients = new Map<string, ReplicacheClient>();

    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i]!;

      const { id, clientID } = mutation;

      // Step 3 and 4: Get/Create client and verify that it belongs to the client group
      // let client = clients[makeClientKey(clientID, clientGroup.id)];
      let client = clients.get(makeClientKey(clientID, clientGroup.id));

      if (!client) {
        client = await getClient(
          clientID,
          clientGroup.id,
          nextVersion,
          id,
          storage
        );

        clients.set(makeClientKey(clientID, clientGroup.id), client);
      }

      // Step 5: Verify that the mutation id is the next expected mutation id from user
      const expectedMutationID = client.lastMutationID + 1;

      // This means mutation already processed - skip the mutation
      if (id < expectedMutationID) continue;

      // A mutation from the future
      if (id > expectedMutationID) throw new Error("Mutation from the future");

      // Step 6: Run the mutation
      await runner({ mutation, nextVersion, storage });

      client.lastMutationID = expectedMutationID;
      client.lastModifiedVersion = nextVersion;

      clients.set(makeClientKey(clientID, clientGroup.id), client);
    }

    versions.set("globalVersion", nextVersion);

    // Step 7: Update the clients
    await storage.put({ versions, ...Object.fromEntries(clients) });

    // TODO - Step 8 send a poke or call passed poke function
    poker?.();
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
  const key = makeClientKey(id, clientGroupID);

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
    id: key,
    clientGroupID: clientGroupID,
    lastMutationID: 0,
    lastModifiedVersion,
  });

  return { id: key, clientGroupID, lastMutationID: 0, lastModifiedVersion };
}

async function getClientGroup(
  clientGroupId: string,
  userId: string,
  storage: Storage,
  withCreate = true
) {
  const key = makeClientGroupKey(clientGroupId);

  // Check for existent client group
  const clientGroup = await storage.get<ReplicacheClientGroup>(key);

  // If client group exists, check if it belongs to the user and returns it if it does
  if (clientGroup) {
    if (clientGroup.userID !== userId) throw authError;

    return clientGroup;
  }

  if (!withCreate) return null;
  // Client group does not exist, create it and return it
  await storage.put(key, {
    id: key,
    userID: userId,
  });

  return { id: key, userID: userId };
}
