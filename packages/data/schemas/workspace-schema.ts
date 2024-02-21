import { z } from "zod";

export const NewWorkspaceSchema = z.object({
  id: z.string().length(21),
  name: z
    .string({
      required_error: "Workspace name is required",
    })
    .max(70, "Workspace name is too long")
    .min(1, "Workspace name is required"),
  avatar: z.optional(z.string().url()).or(z.literal("")),
});

export type NewWorkspaceType = z.infer<typeof NewWorkspaceSchema>;

// meta
/**
 * {
 * owner
 * avatar
 * name
 * createdAt
 * invite link
 * teams max 10
 * settings*
 * }
 *
 *
 * roles 'by name': { max 10 + 2 base
 * name
 * permissions read/write/admin/team admin
 * color
 * }
 *
 * channels{
 * id : {roles ,team}
 * }
 *
 *
 * members {
 * id : {roles, data, teams}
 * }
 */
