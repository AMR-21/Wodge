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
import { USER_WORKSPACES_STORE_KEY } from "../../keys";
import { env } from "@repo/env";
import { WorkspacesRegistry } from "./workspaces-model";

export type WorkspacesStore = UserWorkspacesStore["workspaces"];

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
    await this.store.mutate.createWorkspace(data);

    const workspacesRegistry = WorkspacesRegistry.getInstance();
    const workspace = workspacesRegistry.getWorkspace(data.id);

    await workspace.createWorkspace(data);
  }

  /**
   * Get workspaces store
   */
  async getWorkspaces() {
    return await this.store.query(
      (tx: ReadTransaction) =>
        tx.get<WorkspacesStore>(USER_WORKSPACES_STORE_KEY)!
    );
  }
}

const mutators = {
  async createWorkspace(tx: WriteTransaction, data: NewWorkspace) {
    const validatedFields = NewWorkspaceSchema.safeParse(data);

    if (!validatedFields.success) throw new Error("Invalid data");

    const { data: newWorkspace } = validatedFields;

    const workspacesStore = (await tx.get<WorkspacesStore>(
      USER_WORKSPACES_STORE_KEY
    )) as string[];

    if (!workspacesStore) {
      return await tx.set(USER_WORKSPACES_STORE_KEY, [newWorkspace.id]);
    }

    // workspaces with similar id already exists
    if (workspacesStore.includes(newWorkspace.id))
      throw new Error("Workspace already exists");

    await tx.set(USER_WORKSPACES_STORE_KEY, [
      ...workspacesStore,
      newWorkspace.id,
    ]);
  },
};

type UserMutators = typeof mutators;