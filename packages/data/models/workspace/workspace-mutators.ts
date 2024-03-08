import { WriteTransaction } from "replicache";
import {
  Role,
  RoleSchema,
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
import { index } from "drizzle-orm/mysql-core";

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

  async createRole (tx: WriteTransaction, role: DrObj<Role>) {
    //1. Validate the data
    const validatedFields = RoleSchema.safeParse(role);
    //  Bug: Should throw an error if the data is invalid
    if (!validatedFields.success) {
      return;
    }
    const { data: newRole } = validatedFields;
     //2. Validate if the role is already existing
     const roleExists = (await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!.roles.some((r) => r.id === role.id);
     if (roleExists) {
       return;
     }
     //3. Create the role
     const newStructure = produce((await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!, (draft) => {
       draft.roles.push(newRole);
     });
     //4. Persist the mutation
     await tx.set(makeWorkspaceStructureKey(), newStructure);
  },
  
async updateTeam (tx: WriteTransaction, team: DrObj<Team>) {
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

  //3. Update the team
  const newStructure = produce((await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!, (draft) => {
    const index = draft.teams.findIndex((t) => t.id === newTeam.id);
    if (index != -1) {
      draft.teams[index] = newTeam;
    }
    else {
      return;
    }
  });
  //4. Persist the mutation
  await tx.set(makeWorkspaceStructureKey(), newStructure);

},
async deleteRole (tx: WriteTransaction, role: DrObj<Role>) {
  // 1. Validate role data using the appropriate schema
  const validatedFields = RoleSchema.safeParse(role);
  
  if (!validatedFields.success) {
    return;
  }
  // 2. Check if the role exists in the WorkspaceStructure
  const workspaceStructure = await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey());
  if (workspaceStructure) {
    const index = workspaceStructure.roles.findIndex((r) => r.id === role.id);
    if (index === -1) {
      return;
    }
  } else {
    throw new Error("Workspace structure not found");
  }
  const deletedRole = role.id
  // 3. Delete the role
  const newStructure = produce((await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!, (draft) => {
    draft.roles = draft.roles.filter((r) => r.id !== deletedRole);
  });
  // 4. Persist the mutation
  await tx.set(makeWorkspaceStructureKey(), newStructure);
},
}
