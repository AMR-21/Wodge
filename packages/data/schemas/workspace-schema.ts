import { z } from "zod";
import {
  BRAND_COLOR,
  ID_LENGTH,
  WORKSPACE_ROLE_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "./config";
import { PublicUserSchema } from "./user-schemas";

/**
 * Workspace {
 *  id
 *  owner
 *  name
 *  avatar
 *  createdAt
 *  settings
 * }
 *

 *
 * structure {
 *  publicChannels:[
 *    chan :{
 *      name
 *      avatar
 *      roles
 *      type
 *   }
 *  ],
 *  teams:[
 *   teamId:{
 *    name
 *    avatar
 *    moderators
 *    channels:[
 *    ]
 *  ],
 *  roles: [
 *    name
 *    color
 *    rules {read write admin manage_resources }
 *    color
 * ]
 * }
 *
 *
 * members:[
 *  {
 *    id
 *    teams
 *    roles
 *    data:{
 *      displayName
 *      avatar
 *      username
 *      id
 *    }
 *  }
 * ]
 *
 * inviteLink:{
 *  url
 *  expires
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
  settings: z.any().optional(),
});

export const RoleSchema = z.object({
  id: z.string().length(WORKSPACE_ROLE_ID_LENGTH),
  name: z.string().max(70),
  rules: z.object({
    read: z.boolean(),
    write: z.boolean(),
    admin: z.boolean(),
  }),
  color: z.string().default(BRAND_COLOR),
});

export const ChannelSchema = z.object({
  id: z.string().length(WORKSPACE_ROLE_ID_LENGTH),
  name: z.string().max(70),
  avatar: z.optional(z.string().url()).or(z.literal("")),
  roles: z.array(z.string().length(WORKSPACE_ROLE_ID_LENGTH)),
  type: z.enum(["text", "voice", "page", "threads", "stage"]),
});

export const TeamSchema = z.object({
  id: z.string().length(WORKSPACE_TEAM_ID_LENGTH),
  name: z.string().max(70),
  moderators: z.array(z.string().length(ID_LENGTH)),
  channels: z.array(ChannelSchema),
});

export const WorkspaceStructureSchema = z.object({
  publicChannels: z.array(ChannelSchema),
  teams: z.array(TeamSchema),
  roles: z.array(RoleSchema),
});

export const MemberSchema = z.object({
  id: z.string().length(ID_LENGTH),
  teams: z.array(z.string().length(WORKSPACE_TEAM_ID_LENGTH)),
  roles: z.array(z.string().length(WORKSPACE_ROLE_ID_LENGTH)),
  data: PublicUserSchema,
});

export const WorkspaceMembersSchema = z.array(MemberSchema);

export const InviteLinkSchema = z.object({
  url: z.string().url(),
  expires: z.date(),
});

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
export type Role = z.infer<typeof RoleSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type WorkspaceStructure = z.infer<typeof WorkspaceStructureSchema>;
export type WorkspaceMembers = z.infer<typeof WorkspaceMembersSchema>;
export type NewWorkspace = z.infer<typeof NewWorkspaceSchema>;
export type inviteLink = z.infer<typeof InviteLinkSchema>;

/** Replicache */
// export type WorkspaceMetadata = {
//   data: WorkspaceType;
//   lastMoDifiedVersion: number;
//   deleted: boolean;
//   isVerified: boolean;
// };

// export type WorkspaceStructure = {
//   data: WorkspaceStructureType;
//   lastMoDifiedVersion: number;
//   deleted: boolean;
// };

// export type WorkspaceMembers = {
//   data: WorkspaceMembersType;
//   lastMoDifiedVersion: number;
//   deleted: boolean;
// };
