import { WriteTransaction } from "replicache";
import {
  Team,
  TeamSchema,
  WorkspaceMembers,
  WorkspaceSchema,
  WorkspaceStructure,
  Workspace,
  defaultWorkspaceStructure,
  Member,
  Group,
} from "../../schemas/workspace.schema";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "../../lib/keys";

import {
  teamUpdateRunner,
  type TeamUpdate,
} from "./mutators/team-update-runner";
import { createTeamMutation } from "./mutators/create-team";
import { deleteTeamMutation } from "./mutators/delete-team";
import { queryClient } from "../../lib/query-client";
import { PublicUserType } from "../../schemas/user.schema";
import { removeMemberMutation } from "./mutators/remove-member";
import { changeMemberRoleMutation } from "./mutators/change-member-role";
import { createGroupMutation } from "./mutators/create-group";
import { GroupUpdate, groupUpdateRunner } from "./mutators/group-update-runner";
import { deleteGroupMutation } from "./mutators/delete-group";
import {
  WorkspaceUpdate,
  updateWorkspaceInfoMutation,
} from "./mutators/workspace-info";

export interface TeamUpdateArgs {
  teamUpdate: TeamUpdate;
  teamId: string;
}

export interface GroupUpdateArgs {
  groupUpdate: GroupUpdate;
  groupId: string;
}

export interface WorkspaceUpdateArgs {
  update: {
    name: Workspace["name"];
    avatar?: Workspace["avatar"];
  };
}

interface RoleUpdateArgs {
  memberId: string;
  role: Member["role"];
}

export const workspaceMutators = {
  async initWorkspace(tx: WriteTransaction, data: Workspace) {
    // 1. Create the workspace
    const validatedFields = WorkspaceSchema.safeParse(data);

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten());
      throw new Error("Invalid workspace data");
    }

    const { data: workspace } = validatedFields;

    const userData = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!userData) throw new Error("User not found");

    // 2. Run the mutation
    await tx.set(makeWorkspaceKey(), workspace);
    await tx.set(makeWorkspaceStructureKey(), {
      ...defaultWorkspaceStructure(),
    });

    await tx.set(makeWorkspaceMembersKey(), {
      members: [
        {
          id: userData.id,
          role: "owner",
          joinInfo: {
            joined_at: new Date().toISOString(),
            token: "",
            created_by: "",
            method: "owner",
          },
        } as Member,
      ],
    });
  },

  async removeMember(tx: WriteTransaction, memberId: string) {
    const workspaceMembers = await tx.get<WorkspaceMembers>(
      makeWorkspaceMembersKey()
    );

    if (!workspaceMembers) throw new Error("Bad data");

    const updateMembers = removeMemberMutation({
      memberId,
      members: workspaceMembers,
    });

    await tx.set(makeWorkspaceMembersKey(), updateMembers);
  },

  async updateWorkspace(
    tx: WriteTransaction,
    workspaceUpdate: WorkspaceUpdateArgs
  ) {
    const workspace = await tx.get<Workspace>(makeWorkspaceKey());

    const { update } = workspaceUpdate;

    if (!workspace) throw new Error("Bad data");

    const newWorkspace = updateWorkspaceInfoMutation({
      workspace,
      update,
    });

    await tx.set(makeWorkspaceKey(), newWorkspace);
  },

  async changeMemberRole(tx: WriteTransaction, roleUpdate: RoleUpdateArgs) {
    const workspaceMembers = await tx.get<WorkspaceMembers>(
      makeWorkspaceMembersKey()
    );

    if (!workspaceMembers) throw new Error("Bad data");

    const updateMembers = changeMemberRoleMutation({
      ...roleUpdate,
      members: workspaceMembers,
    });

    await tx.set(makeWorkspaceMembersKey(), updateMembers);
  },

  async createTeam(
    tx: WriteTransaction,
    data: Pick<Team, "id" | "name" | "avatar">
  ) {
    // 1. Create the team
    // 1. Create the team
    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const structure = await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    );

    if (!structure) throw new Error("Bad data");

    const newStructure = createTeamMutation({
      team: data,
      structure,
      currentUserId: user.id,
    });

    // 2. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async updateTeam(tx: WriteTransaction, update: TeamUpdateArgs) {
    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    ))!;

    const members = await tx.get<WorkspaceMembers>(makeWorkspaceMembersKey());

    if (!members) throw new Error("Bad data");
    if (!structure) throw new Error("Bad data");

    const { teamId, teamUpdate } = update;
    const curMembers = members.members.map((m) => m.id);

    const newStructure = teamUpdateRunner({
      structure,
      teamUpdate,
      teamId,
      curMembers,
    });

    // 3. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async deleteTeam(tx: WriteTransaction, teamId: string) {
    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    if (!structure) throw new Error("Bad data");

    const newStructure = deleteTeamMutation({
      structure,
      teamId,
    });

    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async createGroup(
    tx: WriteTransaction,
    data: Omit<Group, "members" | "createdBy">
  ) {
    // 1. Create the group
    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const structure = await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    );

    if (!structure) throw new Error("Bad data");

    const newStructure = createGroupMutation({
      group: data,
      structure,
      currentUserId: user.id,
    });

    // 2. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async updateGroup(tx: WriteTransaction, update: GroupUpdateArgs) {
    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    ))!;

    const members = await tx.get<WorkspaceMembers>(makeWorkspaceMembersKey());

    if (!members) throw new Error("Bad data");
    if (!structure) throw new Error("Bad data");

    const { groupId, groupUpdate } = update;
    const curMembers = members.members.map((m) => m.id);

    const newStructure = groupUpdateRunner({
      structure,
      groupUpdate,
      groupId,
      curMembers,
    });

    // 3. Persist the mutation
    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },

  async deleteGroup(tx: WriteTransaction, groupId: string) {
    const structure = (await tx.get<WorkspaceStructure>(
      makeWorkspaceStructureKey()
    )) as WorkspaceStructure;

    if (!structure) throw new Error("Bad data");

    const newStructure = deleteGroupMutation({
      structure,
      groupId,
    });

    await tx.set(makeWorkspaceStructureKey(), newStructure);
  },
};
