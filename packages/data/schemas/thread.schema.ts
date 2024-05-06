import { z } from "zod";

import { ChannelSchema } from "./channel.schema";

export const ThreadSchema = ChannelSchema.omit({
  name: true,
  editGroups: true,
  viewGroups: true,
}).extend({
  // post it the post/question
  content: z.string().min(1).max(4096),
  type: z.enum(["post", "qa"]),
  createdBy: z.string(),
  isResolved: z.boolean().default(false).optional(),
  createdAt: z.string().datetime(),
});

export const ThreadMessageSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string().min(1).max(4096),
  date: z.string().datetime(),
  type: z.enum(["message", "open", "close"]),
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
