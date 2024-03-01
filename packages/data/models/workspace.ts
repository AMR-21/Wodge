import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  ReadTransaction,
  Replicache,
  WriteTransaction,
} from "replicache";
import { NewWorkspace, WorkspaceSchema, WorkspaceType } from "..";
import { env } from "@repo/env";
import { User } from "./user";
import { WORKSPACE_PREFIX, makeWorkspaceKey } from "../keys";
import { replicacheWrapper } from "./utils";

// Note on any mutation modify the global state
export class WorkspacesRegistry {
  static #instance: WorkspacesRegistry;
  private registry: Map<string, Workspace>;

  private constructor() {
    if (WorkspacesRegistry.#instance) {
      throw new Error("WorkspacesRegistry already exists");
    }
    this.registry = new Map();
  }

  static getInstance(): WorkspacesRegistry {
    if (!WorkspacesRegistry.#instance) {
      WorkspacesRegistry.#instance = new WorkspacesRegistry();
    }

    return WorkspacesRegistry.#instance;
  }

  hasWorkspace(id: string): boolean {
    return this.registry.has(id);
  }

  getWorkspace(id: string) {
    if (typeof navigator === "undefined") return null;

    if (!this.registry.has(id)) {
      this.registry.set(id, new Workspace(id));
    }

    return this.registry.get(id);
  }
}

export class Workspace {
  store: Replicache<SpaceMutators>;

  constructor(id: string) {
    this.store = new Replicache({
      name: id,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      mutators,
    });

    // Add push/pull endpoints for cloud workspaces
    User.getInstance()
      .getWorkspaces()
      .then((data) => {
        if (data) return data.find((ws) => ws.workspaceId === id);
      })
      .then((data) => {
        if (data && data.environment === "cloud") {
          this.store.pusher = replicacheWrapper<PushRequest, PusherResult>(
            "push",
            "workspace",
            id
          );

          this.store.puller = replicacheWrapper<PullRequest, PullerResult>(
            "pull",
            "workspace",
            id
          );

          this.store.pull();
          this.store.push();
        }
      });
  }

  /** Methods */

  /**
   * Create a new workspace
   */
  async init(data: NewWorkspace) {
    // TODO CHECK IF THE WORKSPACE HAS ALREADY BEEN CREATED
    // 1. build the workspace object
    const workspaceData: WorkspaceType = {
      id: data.id,
      name: data.name,
      avatar: data.avatar,
      environment: data.onCloud ? "cloud" : "local",
      owner: User.getInstance().data.id,
      createdAt: new Date().toISOString(),
    };

    // 2. Run the mutation
    await this.store.mutate.initWorkspace(workspaceData);

    // 3. If it is cloud workspace, then re-init the store
    // Add push/pull endpoints for cloud workspaces
    if (data.onCloud) {
      this.store.pusher = replicacheWrapper<PushRequest, PusherResult>(
        "push",
        "workspace",
        data.id
      );

      this.store.puller = replicacheWrapper<PullRequest, PullerResult>(
        "pull",
        "workspace",
        data.id
      );

      this.store.pull();
      this.store.push();
    }
  }
}

const mutators = {
  async initWorkspace(tx: WriteTransaction, data: WorkspaceType) {
    // validation is an extra needless effort but for purpose of adding extra validation
    // Typically where the case user bypass the function and call the mutation directly
    // 1. Validate the data,
    const validatedFields = WorkspaceSchema.safeParse(data);

    if (!validatedFields.success) {
      throw new Error("Invalid workspace data");
    }

    const { data: workspace } = validatedFields;

    // 2. Create the workspace
    await tx.set(makeWorkspaceKey(data.id), workspace);
  },
};

type SpaceMutators = typeof mutators;
