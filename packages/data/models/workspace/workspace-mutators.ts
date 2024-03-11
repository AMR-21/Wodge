import { WriteTransaction } from "replicache";
import {
  Team,
  TeamSchema,
  WorkspaceSchema,
  WorkspaceStructure,
  WorkspaceType,
  defaultWorkspaceStructure,
} from "../../schemas/workspace.schema";
import { makeWorkspaceKey, makeWorkspaceStructureKey } from "../../lib/keys";
import { DrObj, User } from "../..";
import { produce } from "immer";
import { createWorkspace } from "./mutators/create-workspace";
import { createTeam } from "./mutators/create-team";

export const workspaceMutators = {
  async initWorkspace(tx: WriteTransaction, data: WorkspaceType) {
    // 1. Create the workspace
    const workspace = createWorkspace(data);

    // 2. Run the mutation
    await tx.set(makeWorkspaceKey(), workspace);
  },

  /**
   * on server verify if is allowed
   * run the data
   */
  async createTeam(tx: WriteTransaction, data: Team) {
    // 1. Create the team
    const currentUserId = User.getInstance().data.id;
    const structure = await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    );

    if (!structure) throw new Error("Bad data");

    const newStructure = createTeam({
      team: data,
      structure,
      currentUserId,
    });

    // 2. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },
};
