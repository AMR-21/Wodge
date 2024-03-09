import { produce } from "immer";
import {
  TeamSchema,
  WorkspaceStructure,
} from "../../../schemas/workspace.schema";
import { z } from "zod";

const TeamUpdateSchema = z.object({
  target: z.enum([
    "name",
    "addMembers",
    "removeMembers",
    "addDirs",
    "removeDirs",
    "addTags",
    "removeTags",
    "avatar",
  ]),
  value: TeamSchema.shape.name
    .or(TeamSchema.shape.members)
    .or(TeamSchema.shape.dirs)
    .or(TeamSchema.shape.tags)
    .or(TeamSchema.shape.avatar),

  teamId: TeamSchema.shape.id,
});

export type TeamUpdate = z.infer<typeof TeamUpdateSchema>;

export function updateTeamMutator(
  update: TeamUpdate,
  structure: WorkspaceStructure
) {
  // 0. Validate the update request - mainly needed for the backend
  if (!TeamUpdateSchema.safeParse(update).success)
    throw new Error("Invalid team update data");

  // 1. Pick update key
  const { target, value, teamId } = update;
  let key = target as string;

  if (target.startsWith("add")) key = target.slice(3).toLowerCase();
  if (target.startsWith("remove")) key = target.slice(6).toLowerCase();

  // 2. Validate the data , with strict the received field must exist on parsed data
  // instead of stripping unknown fields - also takes care of case sending a correct key but wrong value
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
