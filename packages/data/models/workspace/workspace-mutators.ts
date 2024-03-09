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

export const workspaceMutators = {
  async initWorkspace(tx: WriteTransaction, data: WorkspaceType) {
    // validation is an extra needless effort but for purpose of adding extra validation
    // Typically where the case user bypass the function and call the mutation directly
    // 1. Validate the data,
    const validatedFields = WorkspaceSchema.safeParse(data);

    if (!validatedFields.success) {
      // throw new Error("Invalid workspace data");
      return;
    }

    const { data: workspace } = validatedFields;

    // 2. Create the workspace
    await tx.set(makeWorkspaceKey(), workspace);

    // 3. Create empty workspace structure
    await tx.set(makeWorkspaceStructureKey(), defaultWorkspaceStructure());
  },

  async createTeam(tx: WriteTransaction, team: DrObj<Team>) {
    //1. Validate the data
    const validatedFields = TeamSchema.safeParse(team);

    //  Bug: Should throw an error if the data is invalid
    if (!validatedFields.success) {
      return;
    }

    const { data: newTeam } = validatedFields;

    // 2. validate owner
    const { id } = User.getInstance().data!;

    //  Bug: Should throw an error if the data is invalid
    if (newTeam.createdBy !== id || !newTeam.members.includes(id)) {
      return;
    }

    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    console.log({ structure });

    // 3. Validate if the team is already existing
    const teamExists = structure.teams.some((t) => t.id === newTeam.id);

    if (teamExists) {
      return;
    }

    // 4. Create the team
    const newStructure = produce(structure, (draft) => {
      draft.teams.push(newTeam);
    });

    // 5. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },
};
