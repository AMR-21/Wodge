import { Team, TeamSchema, WorkspaceStructure } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

interface UpdateTeamMembersArgs extends WorkspaceTeamMutation {
  update: {
    members: Team["members"];
  };
}

export function addTeamMembersMutation({
  update,
  structure,
  teamId,
  curMembers,
}: UpdateTeamMembersArgs & { curMembers: string[] }) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  // 2. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 3. Check if the added members exist in the current workspace
  const invalidMembers = members.filter((m) => !curMembers.includes(m));

  if (invalidMembers.length > 0) throw new Error("Invalid members");

  // 4. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // 5. Update the team
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;

    // Account for duplicate updates - in case of conflicts
    curTeam.members = Array.from(new Set([...curTeam.members, ...members]));
  });

  return newStructure;
}

export function removeTeamMembers({
  update,
  structure,
  teamId,
}: UpdateTeamMembersArgs) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({ members: true })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  // 2. Pick update key
  const {
    data: { members },
  } = validatedFields;

  // 3. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // 4. Update the team
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;

    curTeam.members = curTeam.members.filter((m) => !members.includes(m));
  });

  return newStructure;
}
