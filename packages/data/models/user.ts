import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  ReadTransaction,
  Replicache,
  WriteTransaction,
} from "replicache";

import { replicacheWrapper } from "../lib/utils";
import {
  PublicUserSchema,
  PublicUserType,
  NewWorkspaceSchema,
  NewWorkspace,
  UserWorkspacesStore,
} from "..";
import { makeWorkspacesStoreKey } from "../lib/keys";
import { env } from "@repo/env";
import { WorkspacesRegistry } from "./workspace";
import PartySocket from "partysocket";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: PublicUserType;
};

export class User {
  static #user: User;
  store: Replicache<UserMutators>;
  ws: PartySocket;

  private constructor() {
    // Protect singleton during runtime
    if (User.#user) {
      throw new Error("User already exists");
    }

    const userId = this.data?.id;

    if (!userId) throw new Error("User id not found");

    this.store = new Replicache({
      name: userId,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      pusher: replicacheWrapper<PushRequest, PusherResult>(
        "push",
        "user",
        userId
      ),
      puller: replicacheWrapper<PullRequest, PullerResult>(
        "pull",
        "user",
        userId
      ),
      pullInterval: null,
      mutators,
    });

    this.ws = new PartySocket({
      host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
      party: "user",
      room: userId,
    });

    this.ws.addEventListener("message", (e) => {
      if (e.data === "poke") this.store.pull();
    });
  }

  /** Static methods */
  /**
   * Get the user instance
   */
  static getInstance() {
    if (!User.#user) {
      User.#user = new User();
    }
    return User.#user;
  }

  /**
   * Cache user data locally on sign up
   */

  static cacheUser(data: PublicUserType) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  /** End of static methods */

  /** Getters */
  /**
   * Get the local user data from local storage
   */
  get data(): PublicUserType {
    const localUser = localStorage.getItem("user");

    if (!localUser) {
      throw new Error("User not found in local storage");
    }

    const data = JSON.parse(localUser) as PublicUserType;

    // exaggeration ?
    const validatedFields = PublicUserSchema.safeParse(data);

    if (!validatedFields.success)
      throw new Error("Invalid user data in local storage");

    return validatedFields.data;
  }

  /** Methods */

  /**
   * Create a new workspace
   */
  async createWorkspace(data: NewWorkspace) {
    // 1. if the workspace is to be created on the cloud, init the cloud db
    if (data.onCloud) {
      // post request to the space with owner id
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${data.id}/create`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to create workspace on cloud");
    }

    // 2. Run the mutation
    await this.store.mutate.createWorkspace(data);

    // 3. if the mutation succeed, init the workspace
    const workspacesRegistry = WorkspacesRegistry.getInstance();
    const workspace = workspacesRegistry.getWorkspace(data.id);

    await workspace?.init(data);
  }

  /**
   * Get the user workspaces
   */
  async getWorkspaces() {
    const workspacesStore = await this.store.query((tx: ReadTransaction) =>
      tx.get<UserWorkspacesStore>(makeWorkspacesStoreKey())
    );

    return workspacesStore;
  }
}

const mutators = {
  async createWorkspace(tx: WriteTransaction, data: NewWorkspace) {
    const validatedFields = NewWorkspaceSchema.safeParse(data);

    if (!validatedFields.success) throw new Error("Invalid data");

    const { data: newWorkspace } = validatedFields;

    const workspacesStore = (await tx.get<UserWorkspacesStore>(
      makeWorkspacesStoreKey()
    )) as UserWorkspacesStore;

    // check if workspace already exists
    if (
      !!workspacesStore &&
      workspacesStore?.some((ws) => ws.workspaceId === newWorkspace.id)
    ) {
      throw new Error("Workspace already exists");
    }

    // add the new workspace to the store
    const updatedStore: UserWorkspacesStore = [
      ...(!!workspacesStore ? workspacesStore : []),
      {
        workspaceId: newWorkspace.id,
        environment: newWorkspace.onCloud ? "cloud" : "local",
      },
    ];

    await tx.set(makeWorkspacesStoreKey(), updatedStore);
  },
};

type UserMutators = typeof mutators;
