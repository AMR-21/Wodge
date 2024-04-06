import { z } from "zod";
import { ID_LENGTH, WORKSPACE_GROUP_ID_LENGTH } from "./config";

export type ChannelsTypes = "pages" | "rooms" | "threads";

export const ChannelSchema = z.object({
  id: z.string().length(ID_LENGTH),
  name: z.string().max(70).min(1),
  avatar: z.string().optional(),
  viewGroups: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
  editGroups: z.array(
    z.string().length(WORKSPACE_GROUP_ID_LENGTH).or(z.literal("team-members"))
  ),
});

export const PageSchema = ChannelSchema.extend({});

export const RoomSchema = ChannelSchema.extend({
  type: z.enum(["chat", "stage"]),
});

export const ThreadSchema = ChannelSchema.extend({});

export type Channel = z.infer<typeof ChannelSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
