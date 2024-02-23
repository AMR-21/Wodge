import { ReadTransaction, Replicache, WriteTransaction } from "replicache";
import { NewWorkspaceType, WorkspaceType } from "../../schemas";
import { env } from "@repo/env";
import { User, WorkspacesStore } from "./user-model";

export class WorkspacesRegistry {
  private static instance: WorkspacesRegistry;
  private registry: Map<string, Workspace>;

  private constructor() {
    this.registry = new Map();
  }

  static getInstance(): WorkspacesRegistry {
    if (!WorkspacesRegistry.instance) {
      WorkspacesRegistry.instance = new WorkspacesRegistry();
    }

    return WorkspacesRegistry.instance;
  }

  hasWorkspace(id: string): boolean {
    return this.registry.has(id);
  }

  async getOrAddWorkspace(id: string): Promise<Workspace> {
    // Case where user trying to access space he does not have access to
    const user = await User.getInstance();
    const workspaces = await user.store.query((tx: ReadTransaction) =>
      tx.get<WorkspacesStore>("workspaces")
    );

    if (!workspaces || !workspaces.includes(id)) {
      throw new Error("No workspace found with the given id");
    }

    if (!this.registry.has(id)) {
      this.registry.set(id, new Workspace(id));
    }
    return this.registry.get(id)!;
  }
}

export class Workspace {
  // TODO make store private by adding mutators' wrappers
  store: Replicache<SpaceMutators>;

  constructor(id: string) {
    this.store = new Replicache({
      name: id,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      // pushURL: "/api/replicache-push",
      // pullURL: "/api/pull",
      mutators,
    });
  }
}

const mutators = {
  async createSpace(tx: WriteTransaction, data: WorkspaceType) {
    // 1. With the validated data,
    // await tx.put("spaces", data.id, data);

    console.log("Creating space", data);
  },
};

type SpaceMutators = typeof mutators;
