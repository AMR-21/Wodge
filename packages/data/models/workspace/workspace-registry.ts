import { Workspace } from "./workspace";

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
    if (typeof navigator === "undefined") return;

    if (!id) return;

    if (!this.registry.has(id)) {
      this.registry.set(id, new Workspace(id));
    }

    return this.registry.get(id);
  }

  reInit(id: string) {
    if (typeof navigator === "undefined") return;

    this.registry.set(id, new Workspace(id));
  }
}
