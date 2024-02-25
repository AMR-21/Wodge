import { ReadTransaction, Replicache, WriteTransaction } from "replicache";
import { NewWorkspace, WorkspaceSchema, WorkspaceType } from "../../schemas";
import { env } from "@repo/env";
import { User, WorkspacesStore } from "./user-model";
import { makeWorkspaceKey } from "../../keys";

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
    if (!this.registry.has(id)) {
      this.registry.set(id, new Workspace(id));
    }

    return this.registry.get(id)!;
  }
}

export class Workspace {
  store: Replicache<SpaceMutators>;

  constructor(id: string) {
    this.store = new Replicache({
      name: id,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      // pushURL: "/api/replicache-push",
      // pullURL: "/api/pull",
      mutators,
    });

    // subscribe for workspace meta data changes and add to global state
    // this.store.
  }

  /** Methods */

  /**
   * Create a new workspace
   */
  async createWorkspace(data: NewWorkspace) {
    // TODO CHECK IF THE WORKSPACE HAS ALREADY BEEN CREATED
    // 1. build the workspace object
    const workspaceData: WorkspaceType = {
      ...data,
      owner: User.getInstance().data.id,
      createdAt: new Date().toISOString(),
    };

    // 2. Run the mutation
    await this.store.mutate.createWorkspace(workspaceData);

    // 3. if the mutation succeeds, run add member mutation with the creator
  }
}

const mutators = {
  async createWorkspace(tx: WriteTransaction, data: WorkspaceType) {
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
