import { produce } from "immer";
import {
  DrObj,
  TEAM_MEMBERS_ROLE,
  Team,
  TeamSchema,
  WorkspaceStructure,
} from "../../..";

interface CreateTeamArgs {
  // Any to account for the backend mutation runner - relay on zod to validate the data
  team: Pick<Team, "id" | "name" | "avatar" | "slug">;
  currentUserId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createTeamMutation({
  team,
  structure,
  currentUserId,
}: CreateTeamArgs) {
  // 1. Validate the data
  const validatedFields = TeamSchema.pick({
    id: true,
    name: true,
    avatar: true,
    slug: true,
  }).safeParse(team);

  if (!validatedFields.success) throw new Error("Invalid team data");

  const { data: newTeamBase } = validatedFields;

  // 2. Validate if the team is already existing - i.e. duplicate id/slug
  const teamExists = structure.teams.some(
    (t) => t.id === newTeamBase.id || t.slug === newTeamBase.slug
  );

  if (teamExists) throw new Error("Team already exists");

  // 3. Sanitize the input team with no members and tags
  const newTeam: Team = {
    ...newTeamBase,
    createdBy: currentUserId,
    members: [currentUserId],
    moderators: [],
    folders: [
      {
        name: "root",
        channels: [],
        id: "root-" + newTeamBase.id,
        editGroups: [TEAM_MEMBERS_ROLE],
        viewGroups: [TEAM_MEMBERS_ROLE],
      },
    ],
    tags: [],
    rooms: [],
    threads: [],
    default: false,
  };

  // 4. Create the team
  const newStructure = produce(structure, (draft) => {
    draft.teams.push(newTeam);
  });

  return newStructure as WorkspaceStructure;
}
