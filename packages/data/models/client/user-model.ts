import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
  WriteTransaction,
} from "replicache";
import { replicacheWrapper } from "../utils";
import {
  LocalUserSchema,
  LocalUserType,
  NewWorkspaceSchema,
  NewWorkspaceType,
  UserWorkspacesStoreType,
} from "../../schemas";
import { WORKSPACES_STORE_PREFIX } from "../../prefixes";
import { env } from "@repo/env";
import { WorkspacesRegistry } from "./workspaces-model";

export type WorkspacesStore = UserWorkspacesStoreType["workspaces"];

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: LocalUserType;
};

export class User {
  static #user: User;
  // @ts-ignore
  // TODO make store private by adding mutators' wrappers
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
  get data(): LocalUserType {
    const localUser = localStorage.getItem("user");

    if (!localUser) throw new Error("User not found in local storage");

    const data = JSON.parse(localUser) as LocalUserType;

    // exaggeration ?
    const validatedFields = LocalUserSchema.safeParse(data);

    if (!validatedFields.success)
      throw new Error("Invalid user data in local storage");

    return validatedFields.data;
  }

  /** Methods */
}

const mutators = {
  async createSpace(tx: WriteTransaction, data: NewWorkspaceType) {
    const validatedFields = NewWorkspaceSchema.safeParse(data);

    if (!validatedFields.success) throw new Error("Invalid data");

    const newWorkspace = validatedFields.data;

    const workspacesStore = (await tx.get<WorkspacesStore>(
      WORKSPACES_STORE_PREFIX
    )) as string[];

    if (!workspacesStore) {
      return await tx.set(WORKSPACES_STORE_PREFIX, [newWorkspace.id]);
    }

    // spaces with similar id already exists
    try {
      if (workspacesStore.includes(newWorkspace.id)) return;
    } catch (e) {
      return;
    }

    await tx.set(WORKSPACES_STORE_PREFIX, [
      ...workspacesStore,
      newWorkspace.id,
    ]);

    // TODO: create a new workspace instance
    // Workspaces.createWorkspace();
    const workspaceInstance =
      WorkspacesRegistry.getInstance().getOrAddWorkspace(newWorkspace.id);

    // Todo call mutator
  },
};

type UserMutators = typeof mutators;
