import { z } from "zod";
import {
  BRAND_COLOR,
  ID_LENGTH,
  WORKSPACE_ROLE_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "./config";

/**
 * is_verified
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
 * roles : { max 10
 * id
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

export const WorkspaceSchema = z.object({
  id: z.string().length(ID_LENGTH),
  owner: z.string().length(ID_LENGTH),
  name: z
    .string({
      required_error: "Workspace name is required",
    })
    .max(70, "Workspace name is too long")
    .min(1, "Workspace name is required"),
  avatar: z.optional(z.string().url()).or(z.literal("")),
  createdAt: z.string().datetime(),
  inviteLink: z.object({
    url: z.string().url(),
    expires: z.string().datetime(),
  }),
  // TODO
  settings: z.any().optional(),
  teams: z.any().optional(),
});

export const RolesSchema = z.record(
  z.object({
    id: z.string().length(WORKSPACE_ROLE_ID_LENGTH),
    name: z.string().max(70),
    rules: z.object({
      read: z.boolean(),
      write: z.boolean(),
      admin: z.boolean(),
      teamAdmin: z.string().length(WORKSPACE_TEAM_ID_LENGTH).optional(),
    }),
    color: z.string().default(BRAND_COLOR),
  })
);

export const NewWorkspaceSchema = WorkspaceSchema.pick({
  id: true,
  name: true,
  avatar: true,
});

export const JoinWorkspaceSchema = z.object({
  url: z
    .string({
      required_error: "Invite link is required",
    })
    .url({
      message: "Invalid URL",
    }),
});

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;
export type NewWorkspaceType = z.infer<typeof NewWorkspaceSchema>;
export type RolesType = z.infer<typeof RolesSchema>;
