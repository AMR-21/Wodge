import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  ReadTransaction,
  Replicache,
  WriteTransaction,
} from "replicache";

import { useSubscribe } from "replicache-react";
import { replicacheWrapper } from "../utils";
import {
  PublicUserSchema,
  PublicUserType,
  NewWorkspaceSchema,
  NewWorkspace,
  UserWorkspacesStore,
} from "../../schemas";
import { makeWorkspacesStoreKey } from "../../keys";
import { env } from "@repo/env";
import { WorkspacesRegistry } from "./workspaces-model";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: PublicUserType;
};

export class User {
  static #user: User;
  store: Replicache<UserMutators>;

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

    if (!localUser) throw new Error("User not found in local storage");

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
    console.log(data);
    // await this.store.mutate.createWorkspace(data);

    // // Add a workspace instance
    // const workspacesRegistry = WorkspacesRegistry.getInstance();
    // const workspace = workspacesRegistry.getWorkspace(data.id);

    // await workspace.init(data);
  }

  /**
   * Get workspaces store
   */
  async getWorkspaces() {
    return await this.store.query(
      (tx: ReadTransaction) =>
        tx.get<UserWorkspacesStore>(makeWorkspacesStoreKey())!
    );
  }
}

const mutators = {
  async createWorkspace(tx: WriteTransaction, data: NewWorkspace) {
    const validatedFields = NewWorkspaceSchema.safeParse(data);

    if (!validatedFields.success) throw new Error("Invalid data");

    const { data: newWorkspace } = validatedFields;

    const workspacesStore = await tx.get<UserWorkspacesStore>(
      makeWorkspacesStoreKey()
    );

    if (!workspacesStore) {
      return await tx.set(makeWorkspacesStoreKey(), [newWorkspace.id]);
    }

    // workspaces with similar id already exists
    if (workspacesStore.includes(newWorkspace.id))
      throw new Error("Workspace already exists");

    await tx.set(makeWorkspacesStoreKey(), [
      ...workspacesStore,
      newWorkspace.id,
    ]);
  },
};

type UserMutators = typeof mutators;
