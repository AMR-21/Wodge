"use client";

import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  ReadTransaction,
  Replicache,
  WriteTransaction,
} from "replicache";

import { getWorkspace, replicacheWrapper } from "../../lib/utils";
import {
  PublicUserSchema,
  PublicUserType,
  NewWorkspaceSchema,
  NewWorkspace,
  UserWorkspacesStore,
  PokeMessage,
  WorkspacesRegistry,
} from "../..";
import { makeWorkspacesStoreKey } from "../../lib/keys";
import { env } from "@repo/env";
import PartySocket from "partysocket";
import { userMutators } from "./user-mutators";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: PublicUserType;
};

export class User {
  static #user: User;
  store: Replicache<typeof userMutators>;
  webSocket: PartySocket;

  private constructor() {
    const userId = this.data?.id;

    // if (!userId) throw new Error("User id not found");

    // this.store = new Replicache({
    //   name: userId,
    //   licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
    //   pusher: replicacheWrapper<PushRequest, PusherResult>(
    //     "push",
    //     "user",
    //     userId
    //   ),
    //   puller: replicacheWrapper<PullRequest, PullerResult>(
    //     "pull",
    //     "user",
    //     userId
    //   ),
    //   pullInterval: null,
    //   mutators: userMutators,
    // });

    // this.webSocket = this.#initWebSocket(userId);
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

    const data = JSON.parse(localUser!) as PublicUserType;

    const validatedFields = PublicUserSchema.safeParse(data);

    // if (!validatedFields.success)
    //   throw new Error("Invalid user data in local storage");

    return validatedFields.data;
  }

  get ws(): PartySocket {
    return this.webSocket;
  }

  /**
   * helpers
   */

  #initWebSocket(userId: string) {
    const ws = new PartySocket({
      host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
      party: "user",
      room: userId,
    });

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data) as { sub: string } & PokeMessage;

      if (data.sub === "poke") {
        switch (data.type) {
          case "workspace":
            const workspace = getWorkspace(data.id!);
            return workspace?.store.pull();

          case "channel":
            return;
          default:
            this.store.pull();
        }
      }
    });

    return ws;
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

    // // 2. Run the mutation
    await this.store.mutate.createWorkspace(data);

    // // 3. if the mutation succeed, init the workspace
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
