import { produce } from "immer";
import { DrObj, Team, TeamSchema, WorkspaceStructure } from "../../..";

interface CreateTeamArgs {
  // Any to account for the backend mutation runner - relay on zod to validate the data
  team: any;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  currentUserId: string;
}

export function createTeam({ team, structure, currentUserId }: CreateTeamArgs) {
  //1. Validate the data
  const validatedFields = TeamSchema.safeParse(team);

  if (!validatedFields.success) throw new Error("Invalid team data");

  const { data: newTeam } = validatedFields;

  // 2. validate owner
  if (
    newTeam.createdBy !== currentUserId ||
    !newTeam.members.includes(currentUserId)
  )
    throw new Error("Unauthorized team creation");

  // 3. Validate if the team is already existing - i.e. duplicate id
  const teamExists = structure.teams.some((t) => t.id === newTeam.id);

  if (teamExists) throw new Error("Team already exists");

  // 4. Create the team
  const newStructure = produce(structure, (draft) => {
    draft.teams.push(newTeam);
  });

  return newStructure;
}
