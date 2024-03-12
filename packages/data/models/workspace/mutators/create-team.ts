import { produce } from "immer";
import { DrObj, Team, TeamSchema, WorkspaceStructure } from "../../..";

interface CreateTeamArgs {
  // Any to account for the backend mutation runner - relay on zod to validate the data
  team: Pick<Team, "id" | "name" | "createdBy" | "avatar">;
  currentUserId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createTeam({ team, structure, currentUserId }: CreateTeamArgs) {
  //1. Validate the data
  const validatedFields = TeamSchema.pick({
    id: true,
    name: true,
    createdBy: true,
    avatar: true,
  }).safeParse(team);

  if (!validatedFields.success) throw new Error("Invalid team data");

  const { data: newTeamBase } = validatedFields;

  // 2. validate owner
  if (newTeamBase.createdBy !== currentUserId)
    throw new Error("Unauthorized team creation");

  // 3. Validate if the team is already existing - i.e. duplicate id
  const teamExists = structure.teams.some((t) => t.id === newTeamBase.id);

  if (teamExists) throw new Error("Team already exists");

  // 4. Sanitize the input team with no members and tags
  const newTeam: Team = {
    ...newTeamBase,
    members: [],
    dirs: [{ name: "root", channels: [], id: "root" }],
    tags: [],
  };

  // 5. Create the team
  const newStructure = produce(structure, (draft) => {
    draft.teams.push(newTeam);
  });

  return newStructure as WorkspaceStructure;
}
