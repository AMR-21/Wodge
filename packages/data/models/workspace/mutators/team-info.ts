import { Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

export interface TeamInfoUpdate extends WorkspaceTeamMutation {
  update: {
    name: Team["name"];
    avatar?: Team["avatar"];
  };
}

export function updateTeamInfo({ structure, update, teamId }: TeamInfoUpdate) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({
    avatar: true,
    name: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  const {
    data: { name, avatar },
  } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((team) => team.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // 3. Update the team
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;
    if (name) curTeam.name = name;
    if (avatar) curTeam.avatar = avatar;
  });

  return newStructure;
}
