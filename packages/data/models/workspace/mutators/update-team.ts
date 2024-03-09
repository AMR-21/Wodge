import { produce } from "immer";
import {
  Team,
  TeamSchema,
  WorkspaceStructure,
} from "../../../schemas/workspace.schema";

export interface TeamUpdate {
  target:
    | "name"
    | "addMembers"
    | "removeMembers"
    | "addDirs"
    | "removeDirs"
    | "addTags"
    | "removeTags"
    | "avatar";
  value: Team["name"] | Team["members"] | Team["dirs"] | Team["tags"];
  teamId: Team["id"];
}

export function updateTeamMutator(
  update: TeamUpdate,
  structure: WorkspaceStructure
) {
  // 1. pick update key
  const { target, value, teamId } = update;
  let key = target as string;

  if (target.startsWith("add")) key = target.slice(3).toLowerCase();
  if (target.startsWith("remove")) key = target.slice(6).toLowerCase();

  // 2. Validate the data , with strict the received field must exist on parsed data
  // instead of stripping unknown fields
  const validatedFields = TeamSchema.pick({ [key]: true })
    .strict()
    .safeParse({
      [key]: value,
    });

  if (!validatedFields.success) throw new Error("Invalid team data");

  const { data: updatedData } = validatedFields;

  const curIdx = structure.teams.findIndex((t) => t.id === teamId);

  if (curIdx === -1) throw new Error("Team not found");

  const newStructure = produce(structure, (draft) => {
    const cur = draft.teams[curIdx]!;
    switch (target) {
      case "name":
        cur.name = updatedData.name;
        break;
      case "addMembers":
        updatedData.members.forEach((m) => {
          if (!cur.members.includes(m)) {
            cur.members.push(m);
          }
        });
        break;
      case "removeMembers":
        if (updatedData.members.includes(cur.createdBy))
          throw new Error("Cannot remove the owner");

        cur.members = cur.members.filter(
          (m) => !updatedData.members.includes(m)
        );
        break;
      case "addDirs":
        updatedData.dirs.forEach((d) => {
          if (!cur.dirs.includes(d)) {
            cur.dirs.push(d);
          }
        });
        break;
      case "removeDirs":
        cur.dirs = cur.dirs.filter((d) => !updatedData.dirs.includes(d));
        break;
      case "addTags":
        updatedData.tags.forEach((t) => {
          if (!cur.tags.includes(t)) {
            cur.tags.push(t);
          }
        });
        break;
      case "removeTags":
        cur.tags = cur.tags.filter((t) => !updatedData.tags.includes(t));
        break;
      case "avatar":
        cur.avatar = updatedData.avatar;
        break;
      default:
        throw new Error("Invalid update target");
    }
  });

  return newStructure;
}
