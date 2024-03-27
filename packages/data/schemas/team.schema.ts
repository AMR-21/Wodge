import { z } from "zod";
import {
  BRAND_COLOR,
  ID_LENGTH,
  TEAM_MEMBERS_ROLE,
  WORKSPACE_GROUP_ID_LENGTH,
  WORKSPACE_TEAM_ID_LENGTH,
} from "./config";
import { PageSchema, RoomSchema, ThreadSchema } from "./channel.schema";
import { nanoid } from "nanoid";

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

export const TeamSchema = z.object({
  id: z.string().length(WORKSPACE_TEAM_ID_LENGTH),
  name: z.string().max(70).min(1),
  avatar: z.optional(z.string()),
  members: z.array(z.string().length(ID_LENGTH)),
  moderators: z.array(z.string().length(ID_LENGTH)),
  createdBy: z.string().length(ID_LENGTH),

  folders: z.array(FolderSchema),
  rooms: z.array(RoomSchema),
  threads: z.array(ThreadSchema),
  tags: z.array(TagSchema),
  slug: z.string().max(32).min(1),
  default: z.boolean().default(false),
});

export type Team = z.infer<typeof TeamSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Folder = z.infer<typeof FolderSchema>;
