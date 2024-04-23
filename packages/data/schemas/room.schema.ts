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
    .enum(["text", "mention", "image", "voice", "video", "file"])
    .default("text"),
});

export const RoomSchema = ChannelSchema.extend({
  // type: z.enum(["chat", "stage"]),
  // messages: z.array(MessageSchema),
});

export type Room = z.infer<typeof RoomSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type React = z.infer<typeof ReactionSchema>;
