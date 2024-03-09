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
import { DrObj, User, UserSchema, Workspace } from "../..";
import { produce } from "immer";
import lodash from "lodash";
import { R } from "vitest/dist/reporters-MmQN-57K.js";
import { updateTeamMutator } from "./mutators/update-team";

export interface TeamUpdate {
  target:
    | "name"
    | "addMembers"
    | "removeMembers"
    | "addDirs"
    | "removeDirs"
    | "addTags"
    | "removeTags"
    | "avatar";
  value: Team["name"] | Team["members"] | Team["dirs"] | Team["tags"];
  teamId: Team["id"];
}

export interface RoleUpdate {
  target:
    | "name"
    | "addMembers"
    | "removeMembers"
    | "color"
    | "linkTeam"
    | "unlinkTeam"
    | "addPermissions"
    | "removePermissions";
  value:
    | Role["name"]
    | Role["members"]
    | Role["color"]
    | Role["linkedTeams"]
    | Role["permissions"];
  roleId: Role["id"];
}

export const workspaceMutators = {
  // *Initiate workspace mutator
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

  // *Teams mutators
  async createTeam(tx: WriteTransaction, team: DrObj<Team>) {
    //1. Validate the data
    const validatedFields = TeamSchema.safeParse(team);

    if (!validatedFields.success) throw new Error("Invalid team data");

    const { data: newTeam } = validatedFields;

    // 2. validate owner
    const { id } = User.getInstance().data!;

    if (newTeam.createdBy !== id || !newTeam.members.includes(id))
      throw new Error("Invalid team data");

    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    // 3. Validate if the team is already existing
    const teamExists = structure.teams.some((t) => t.id === newTeam.id);

    if (teamExists) throw new Error("Team already exists");

    // 4. Create the team
    const newStructure = produce(structure, (draft) => {
      draft.teams.push(newTeam);
    });

    // 5. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  //fixme
  async updateTeam(tx: WriteTransaction, update: TeamUpdate) {
    // 1. Read the workspace structure
    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    // 2. Run the mutation
    const newStructure = updateTeamMutator(update, structure);

    //4. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async deleteTeam(tx: WriteTransaction, teamId: string) {
    //Fixme - no need to validate the team id
    // 1.Validate the team
    // const validatedFields = TeamSchema.safeParse(team);
    //  !Bug: Should throw an error if the data is invalid

    // if (!validatedFields.success) {
    //   return;
    // }

    // const { data: theTeam } = validatedFields;

    // fixme No need
    // // 2. validate owner
    // const { id } = User.getInstance().data!;

    // //  !Bug: Should throw an error if the data is invalid
    // if (theTeam.createdBy !== id || !theTeam.members.includes(id)) {
    //   return;
    // }

    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    // 1. check if the team not existing
    const teamExists = structure.teams.some((t) => t.id === teamId);

    if (!teamExists) throw new Error("Team not found");

    // 2. Delete the team
    const newStructure = produce(structure, (draft) => {
      draft.teams = draft.teams.filter((team) => team.id !== teamId);
    });

    // 3.persist data
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  // *Roles mutators
  async createRole(tx: WriteTransaction, role: DrObj<Role>) {
    //1. Validate the data
    const validatedFields = RoleSchema.safeParse(role);

    if (!validatedFields.success) throw new Error("Invalid role data");

    const { data: newRole } = validatedFields;

    //2. Validate if the role is already existing
    const roleExists = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    ))!.roles.some((r) => r.id === role.id);

    if (roleExists) throw new Error("Role already exists");

    //3. Create the role
    const newStructure = produce(
      (await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!,
      (draft) => {
        draft.roles.push(newRole);
      }
    );
    //4. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  //fixme
  async updateRole(tx: WriteTransaction, update: RoleUpdate) {
    // 1. pick update key
    const { target, value, roleId } = update;
    let key = target as string;

    if (target.startsWith("add")) key = target.slice(3).toLowerCase();
    if (target.startsWith("remove")) key = target.slice(6).toLowerCase();

    // 2. Validate the data , with strict the received field must exist on parsed data
    // instead of stripping unknown fields
    const validatedFields = RoleSchema.pick({ [key]: true })
      .strict()
      .safeParse({
        [key]: value,
      });

    if (!validatedFields.success) throw new Error("Invalid role data");

    const { data: updatedData } = validatedFields;

    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    ))!;

    const curIdx = structure.roles.findIndex((r) => r.id === roleId);

    if (curIdx === -1) throw new Error("Team not found");

    const newStructure = produce(structure, (draft) => {
      const cur = draft.roles[curIdx]!;
      switch (target) {
        case "name":
          cur.name = updatedData.name;
          break;
        case "addMembers":
          updatedData.members.forEach((m) => {
            if (!cur.members.includes(m)) {
              cur.members.push(m);
            }
          });
          break;
        case "removeMembers":
          cur.members = cur.members.filter(
            (m) => !updatedData.members.includes(m)
          );
          break;
        case "addPermissions":
          updatedData.permissions.forEach((d) => {
            if (!cur.permissions.includes(d)) {
              cur.permissions.push(d);
            }
          });
          break;
        case "removePermissions":
          cur.permissions = cur.permissions.filter(
            (d) => !updatedData.permissions.includes(d)
          );
          break;
        case "linkTeam":
          updatedData.linkedTeams.forEach((t) => {
            if (!cur.linkedTeams.includes(t)) {
              cur.linkedTeams.push(t);
            }
          });
          break;
        case "unlinkTeam":
          cur.linkedTeams = cur.linkedTeams.filter(
            (t) => !updatedData.linkedTeams.includes(t)
          );
          break;
        case "color":
          cur.color = updatedData.color;
          break;
        default:
          throw new Error("Invalid update target");
      }
    });
    // //3. Update the role
    // const newStructure = produce(
    //   (await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!,
    //   (draft) => {
    //     const index = draft.roles.findIndex((role) => role.id === newRole.id);
    //     if (index != -1) {
    //       draft.roles[index] = newRole;
    //     } else {
    //       return;
    //     }
    //   }
    // );
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async deleteRole(tx: WriteTransaction, role: DrObj<Role>) {
    // 1. Validate role data using the appropriate schema
    const validatedFields = RoleSchema.safeParse(role);

    if (!validatedFields.success) {
      return;
    }
    // 2. Check if the role exists in the WorkspaceStructure
    const workspaceStructure = await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    );
    if (workspaceStructure) {
      const index = workspaceStructure.roles.findIndex((r) => r.id === role.id);
      if (index === -1) {
        return;
      }
    } else {
      throw new Error("Workspace structure not found");
    }

    const deletedRole = role.id;
    // 3. Delete the role
    const newStructure = produce(
      (await tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()))!,
      (draft) => {
        draft.roles = draft.roles.filter((r) => r.id !== deletedRole);
      }
    );
    // 4. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },
  // fixme - need more deletions
  async deleteWorkspace(tx: WriteTransaction) {
    //1.check that the user deleting is the owner
    const deletinguser = User.getInstance().data!;
    const workspace = await tx.get<WorkspaceType>(makeWorkspaceKey());
    if (workspace?.owner !== deletinguser.id) {
      return;
    }
    //1. delete workspace
    const result = await tx.del(makeWorkspaceKey());
    if (!result) {
      return;
    }
    //3. delete workspace structure
    const result2 = await tx.del(makeWorkspaceStructureKey());
    if (!result2) {
      return;
    }
  },
};
