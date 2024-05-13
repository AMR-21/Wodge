import { z } from "zod";

import { ChannelSchema } from "./channel.schema";

export const ThreadSchema = ChannelSchema.omit({
  name: true,
  editGroups: true,
  viewGroups: true,
}).extend({
  content: z.string().min(1).max(4096),
  type: z.enum(["post", "qa", "poll"]),
  createdBy: z.string(),
  isResolved: z.boolean().default(false).optional(),
  isEdited: z.boolean().default(false).optional(),
  createdAt: z.string().datetime(),
  pollOptions: z.array(z.string()).optional().default([]),
  votes: z.array(z.number()).optional().default([]),
  pollVoters: z
    .array(
      z.object({
        voter: z.string(),
        option: z.number(),
      })
    )
    .optional()
    .default([]),
  isVoteOpen: z.boolean().default(true).optional(),
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
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 10;
