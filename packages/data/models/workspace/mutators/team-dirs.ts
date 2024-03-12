import { Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

interface UpdateTeamDirArgs extends WorkspaceTeamMutation {
  update: { dirs: Team["dirs"] };
}

export function addTeamDirsMutation({
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
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  if (
    structure.teams[teamIdx]!.dirs.some((dir) =>
      dirs.some((d) => d.id === dir.id)
    )
  )
    throw new Error("Dir already exists in team");

  // 3. Update the dirs
  const newStructure = produce(structure, (draft) => {
    draft.teams[teamIdx]!.dirs.push(...dirs);
  });

  return newStructure;
}

export function deleteTeamDirsMutation({
  structure,
  update,
  teamId,
}: WorkspaceTeamMutation & { update: { dirs: string[] } }) {
  // 1. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // const removalIds = update.map((dir) => dir.id);

  // 2. Update the dirs
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;
    curTeam.dirs = curTeam.dirs.filter((dir) => !update.dirs.includes(dir.id));
  });

  return newStructure;
}
