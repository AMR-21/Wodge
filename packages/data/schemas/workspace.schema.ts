import { z } from "zod";
import {
  BRAND_COLOR,
  ID_LENGTH,
  WORKSPACE_GROUP_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "./config";

export const WorkspaceSchema = z.object({
  id: z.string().length(ID_LENGTH),
  owner: z.string().length(ID_LENGTH),
  name: z
    .string({
      required_error: "Workspace name is required",
    })
    .max(70, "Workspace name is too long")
    .min(1, "Workspace name is required"),
  avatar: z.string(),
  createdAt: z.string().datetime(),
  // To be removed - all on cloud
  environment: z.enum(["local", "cloud"]),
});

export const ChannelSchema = z.object({
  id: z.string().length(ID_LENGTH),
  name: z.string().max(70).min(1),
  avatar: z.string().optional(),
  viewRoles: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
  editRoles: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
});

export const PageSchema = ChannelSchema.extend({});

export const ChatSchema = ChannelSchema.extend({});

export const ThreadSchema = ChannelSchema.extend({});

export const TagSchema = z.object({
  name: z.string().max(70),
  color: z.string().default(BRAND_COLOR).optional(),
});

export const FolderSchema = z.object({
  id: z.string().length(WORKSPACE_GROUP_ID_LENGTH),
  name: z.string().max(70).min(1),
  channels: z.array(PageSchema),
  // As a preset of underline channels
  viewRoles: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
  editRoles: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
});

export const MemberSchema = z.object({
  id: z.string().length(ID_LENGTH),
  role: z.enum(["owner", "admin", "member"]),
  joinInfo: z.object({
    token: z.string(),
    created_by: z.string().length(ID_LENGTH),
    joined_at: z.string().datetime(),
    method: z.enum(["link", "email", "owner"]),
  }),
});

export const GroupSchema = z.object({
  id: z.string().length(WORKSPACE_GROUP_ID_LENGTH),
  name: z.string().max(70).min(1),
  members: z.array(z.string().length(ID_LENGTH)),
  color: z.string().default(BRAND_COLOR),
  createdBy: z.string().length(ID_LENGTH),
});

export const TeamSchema = z.object({
  id: z.string().length(WORKSPACE_TEAM_ID_LENGTH),
  name: z.string().max(70).min(1),
  avatar: z.optional(z.string()),
  members: z.array(z.string().length(ID_LENGTH)),
  moderators: z.array(z.string().length(ID_LENGTH)),
  createdBy: z.string().length(ID_LENGTH),

  folders: z.array(FolderSchema),
  chats: z.array(ChatSchema),
  threads: z.array(ThreadSchema),
  tags: z.array(TagSchema),
});

export const WorkspaceStructureSchema = z.object({
  teams: z.array(TeamSchema),
  groups: z.array(GroupSchema),
  tags: z.array(TagSchema),
});

export const WorkspaceMembersSchema = z.object({
  owner: z.string().length(ID_LENGTH),
  members: z.array(MemberSchema),
});

export const NewInviteSchema = z.object({
  limit: z.number().int().positive().default(Infinity),
  method: z.enum(["link", "email", "owner"]),
  // emails: z.array(z.string().email()).optional(),
});
// .refine(
//   (data) => {
//     if (
//       data.method === "email" &&
//       (!data.emails || data.emails.length === 0)
//     ) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message: "Emails are required",
//   }
// );

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

export const PresenceRequestSchema = z.object({
  userId: z.string().length(ID_LENGTH),
  connect: z.boolean(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Folder = z.infer<typeof FolderSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type Thread = z.infer<typeof ThreadSchema>;

export type WorkspaceStructure = z.infer<typeof WorkspaceStructureSchema>;
export type WorkspaceMembers = z.infer<typeof WorkspaceMembersSchema>;

export type NewWorkspace = z.infer<typeof NewWorkspaceSchema>;
export type Invite = z.infer<typeof NewInviteSchema> & {
  createdBy: string;
  token: string;
};

export type Invites = Map<string, Invite>;

export type NewInvite = z.infer<typeof NewInviteSchema>;

export function defaultWorkspaceMembers(): WorkspaceMembers {
  return {
    owner: "",
    members: [],
  };
}

export function defaultWorkspaceStructure(): WorkspaceStructure {
  return {
    teams: [],
    groups: [],
    tags: [],
  };
}
