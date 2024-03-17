import { Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

interface UpdateTeamDirArgs extends WorkspaceTeamMutation {
  update: { folders: Team["folders"] };
}

export function addTeamFoldersMutation({
  structure,
  update,
  teamId,
}: UpdateTeamDirArgs) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({
    folders: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  const {
    data: { folders },
  } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  if (
    structure.teams[teamIdx]!.folders.some((folder) =>
      folders.some((f) => f.id === folder.id)
    )
  )
    throw new Error("Folder already exists in team");

  // 3. Update the dirs
  const newStructure = produce(structure, (draft) => {
    draft.teams[teamIdx]!.folders.push(...folders);
  });

  return newStructure;
}

export function deleteTeamFoldersMutation({
  structure,
  update,
  teamId,
}: WorkspaceTeamMutation & { update: { folders: string[] } }) {
  // 1. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  // const removalIds = update.map((dir) => dir.id);

  // 2. Update the folders
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;
    curTeam.folders = curTeam.folders.filter(
      (f) => !update.folders.includes(f.id)
    );
  });

  return newStructure;
}
