import { WriteTransaction } from "replicache";
import {
  Team,
  WorkspaceSchema,
  WorkspaceStructure,
  WorkspaceType,
  defaultWorkspaceStructure,
} from "../../schemas/workspace.schema";
import { makeWorkspaceKey, makeWorkspaceStructureKey } from "../../lib/keys";
import { DrObj } from "../..";
import { produce } from "immer";

export const workspaceMutators = {
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
    await tx.set(makeWorkspaceKey(), workspace);

    // 3. Create empty workspace structure
    await tx.set(makeWorkspaceStructureKey(), defaultWorkspaceStructure());
  },

  async changeName(tx: WriteTransaction, name: string) {
    // 1. Get the workspace
    const workspace = await tx.get<WorkspaceType>(makeWorkspaceKey());

    // 2. Update the workspace
    await tx.set(makeWorkspaceKey(), { ...workspace, name });
  },
  async createTeam(tx: WriteTransaction, team: Partial<DrObj<Team>>) {
    // 1. Get the workspace structure
    const structure = await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    );

    // 2. Create the team
    const newStructure = produce(structure, (draft) => {
      //@ts-ignore
      draft!.teams.push(team);
    });

    console.log(newStructure);
    // 3. Update the structure
    await tx.set(makeWorkspaceStructureKey(), {
      ...newStructure,
    });
  },
};
