import { Folder, FolderSchema, Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

interface UpdateTeamDirArgs extends WorkspaceTeamMutation {
  update: { folder: Folder };
}

export function addTeamFolderMutation({
  structure,
  update,
  teamId,
}: UpdateTeamDirArgs) {
  // 1. Validate the update request
  const validatedFields = FolderSchema.safeParse({
    ...update.folder,
    channels: [],
    editRoles: ["team-members"],
    viewRoles: ["team-members"],
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten());
    // throw new Error("Invalid team update data");
    return structure;
  }

  const { data: folder } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (teamIdx === -1) throw new Error("Team does not exist");

  if (structure.teams[teamIdx]!.folders.some((f) => f.id === folder.id))
    throw new Error("Folder already exists in team");

  // 3. Update the dirs
  const newStructure = produce(structure, (draft) => {
    draft.teams[teamIdx]!.folders.push(folder);
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
