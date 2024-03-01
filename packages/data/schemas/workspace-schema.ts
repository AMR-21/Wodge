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
 *  tags
 *  teams:[
 *   teamId:{
 *    name
 *    avatar
 *    moderators
 *    tags
 *    dirs:[
 *      none: {
 *        channels:[
 *        
 *        ]  
 *      },
 *      dirName :{
 *       channels:[
 * 
 *       ]
 *      }
 *    ] 
 *    
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
 * members:{
 *  owner
 *  members: [{
 *    id
 *    teams
 *    roles
 *    joinInfo: {
 *      token
 *      created_by
 *      joined_at
 *    } 
 *    data:{
 *      displayName
 *      avatar
 *      username
 *    }
 *  }]
 * }
 *
 * invites:[{
 *  url
 *  expires
 *  limit
 *  createdBy
 * }]
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
  environment: z.enum(["local", "cloud"]),
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
  color: z.string().default(BRAND_COLOR).optional(),
});

export const ChannelSchema = z.object({
  id: z.string().length(WORKSPACE_ROLE_ID_LENGTH),
  name: z.string().max(70),
  avatar: z.optional(z.string().url()).or(z.literal("")),
  roles: z.array(z.string().length(WORKSPACE_ROLE_ID_LENGTH)),
  type: z.enum(["text", "voice", "page", "threads", "stage"]),
});

export const TagSchema = z.object({
  name: z.string().max(70),
  color: z.string().default(BRAND_COLOR).optional(),
});

export const DirSchema = z.object({
  channels: z.array(ChannelSchema),
  name: z.string().max(70),
});

export const TeamSchema = z.object({
  id: z.string().length(WORKSPACE_TEAM_ID_LENGTH),
  name: z.string().max(70),
  avatar: z.optional(z.string()),
  moderators: z.array(z.string().length(ID_LENGTH)),
  dirs: z.array(DirSchema),
  tags: z.array(TagSchema),
});

export const WorkspaceStructureSchema = z.object({
  publicChannels: z.array(ChannelSchema),
  teams: z.array(TeamSchema),
  roles: z.array(RoleSchema),
  tags: z.array(TagSchema),
});

export const MemberSchema = z.object({
  id: z.string().length(ID_LENGTH),
  teams: z.array(z.string().length(WORKSPACE_TEAM_ID_LENGTH)),
  roles: z.array(z.string().length(WORKSPACE_ROLE_ID_LENGTH)),
  data: PublicUserSchema.omit({ id: true }),
  joinInfo: z.object({
    token: z.string(),
    created_by: z.string().length(ID_LENGTH),
    joined_at: z.string().datetime(),
  }),
});

export const WorkspaceMembersSchema = z.object({
  owner: z.string().length(ID_LENGTH),
  members: z.array(MemberSchema),
});

export const InviteLinkSchema = z.object({
  url: z.string().url(),
  expires: z.date(),
});

export const NewWorkspaceSchema = WorkspaceSchema.pick({
  id: true,
  name: true,
  avatar: true,
}).extend({
  onCloud: z.boolean(),
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
export type Tag = z.infer<typeof TagSchema>;

export type WorkspaceStructure = z.infer<typeof WorkspaceStructureSchema>;
export type WorkspaceMembers = z.infer<typeof WorkspaceMembersSchema>;

export type NewWorkspace = z.infer<typeof NewWorkspaceSchema>;
export type inviteLink = z.infer<typeof InviteLinkSchema>;

export function defaultWorkspaceMembers(): WorkspaceMembers {
  return {
    owner: "",
    members: [],
  };
}
