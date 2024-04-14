import { z } from "zod";
import { ID_LENGTH, WORKSPACE_GROUP_ID_LENGTH } from "./config";

export type ChannelsTypes = "page" | "room" | "thread";

export const ChannelSchema = z.object({
  id: z.string().length(ID_LENGTH),
  // act as title
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

export type Channel = z.infer<typeof ChannelSchema>;
export type Page = z.infer<typeof PageSchema>;
