import { Team, TeamSchema } from "../../..";
import { WorkspaceTeamMutation } from "./types";
import { produce } from "immer";

export interface TeamInfoUpdate extends WorkspaceTeamMutation {
  update: {
    name: Team["name"];
    avatar: Team["avatar"];
    slug: Team["slug"];
  };
}

export function updateTeamInfoMutation({
  structure,
  update,
  teamId,
}: TeamInfoUpdate) {
  // 1. Validate the update request
  const validatedFields = TeamSchema.pick({
    avatar: true,
    name: true,
    slug: true,
  })
    .strict()
    .safeParse(update);

  if (!validatedFields.success) throw new Error("Invalid team update data");

  const {
    data: { name, avatar, slug },
  } = validatedFields;

  // 2. Check if team already exists
  const teamIdx = structure.teams.findIndex((t) => t.id === teamId);

  // 3. check if the slug does not exist
  if (slug && structure.teams.some((t) => t.slug === slug && t.id !== teamId))
    throw new Error("Slug already exists");

  if (teamIdx === -1) throw new Error("Team does not exist");

  // 3. Update the team
  const newStructure = produce(structure, (draft) => {
    const curTeam = draft.teams[teamIdx]!;
    if (name) curTeam.name = name;
    if (avatar) curTeam.avatar = avatar;
    if (slug) curTeam.slug = slug;
  });

  return newStructure;
}
