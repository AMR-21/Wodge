import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  ReadTransaction,
  Replicache,
} from "replicache";
import { NewWorkspace, WorkspaceType } from "../..";
import { env } from "@repo/env";
import { User } from "../user/user";
import { makeWorkspaceKey } from "../../lib/keys";

import { replicacheWrapper } from "../../lib/utils";
import { workspaceMutators } from "./workspace-mutators";

export class Workspace {
  store: Replicache<typeof workspaceMutators>;
  id: string;

  constructor(id: string) {
    this.store = new Replicache({
      name: id,
      licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
      mutators: workspaceMutators,
      pullInterval: null,
    });

    // Add push/pull endpoints for cloud workspaces
    User.getInstance()
      .getWorkspaces()
      .then((data) => {
        if (data) return data.find((ws) => ws.workspaceId === id);
      })
      .then((data) => {
        if (data && data.environment === "cloud") {
          this.#makeCloud(id);
        }
      });

    this.id = id;
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
      this.#makeCloud(data.id);
    }
  }

  /**
   * Make the workspace a cloud workspace
   */
  #makeCloud(id: string) {
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

    this.store.push();
    this.store.pull();
  }

  /**
   * Query the workspace metadata
   */
  async getMetadata(tx: ReadTransaction) {
    return tx.get<WorkspaceType>(makeWorkspaceKey(this.id));
  }
}
