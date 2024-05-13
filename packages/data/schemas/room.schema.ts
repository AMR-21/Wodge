import { z } from "zod";
import { ChannelSchema } from "./channel.schema";

export const ReactionSchema = z.object({
  // emoji: z.enum(["💔", "😠", "💓", "👍"]),
  emoji: z.string(),
  count: z.number(),
});

export const MessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  content: z.string().min(1).max(1024),
  date: z.string().datetime(),
  // reactions: z.array()
  reactions: z.array(ReactionSchema).default([]),
  type: z
    .enum(["text", "mention", "image", "audio", "video", "file", "poll"])
    .default("text"),
  isEdited: z.boolean().default(false).optional(),

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

export const RoomSchema = ChannelSchema.extend({});

export type Room = z.infer<typeof RoomSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type React = z.infer<typeof ReactionSchema>;
