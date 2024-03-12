import { Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

interface UpdateTeamDirArgs extends WorkspaceTeamMutation {
  update: { dirs: Team["dirs"] };
}

export function addTeamDirs({ structure, update, teamId }: UpdateTeamDirArgs) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({
    dirs: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  const {
    data: { dirs },
  } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((team) => team.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // 3. Update the dir
  const newStructure = produce(structure, (draft) => {
    draft.teams[teamIdx]!.dirs.push(...dirs);
  });

  return newStructure;
}

export function deleteTeamDirs({
  structure,
  update,
  teamId,
}: UpdateTeamDirArgs) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({
    dirs: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  const {
    data: { dirs },
  } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((team) => team.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  const removalIds = dirs.map((dir) => dir.id);

  // 3. Update the dir
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;
    curTeam.dirs = curTeam.dirs.filter((dir) => !removalIds.includes(dir.id));
  });

  return newStructure;
}
