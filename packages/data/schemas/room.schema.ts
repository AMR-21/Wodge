import { z } from "zod";
import { ID_LENGTH } from "./config";
import { ChannelSchema } from "./channel.schema";

export const MessageSchema = z.object({
  id: z.string(),
  sender: z.string().length(ID_LENGTH),
  content: z.string().min(1).max(1024),
  date: z.string().datetime(),
  type: z.enum(["text", "mention", "image", "voice"]).default("text"),
});

export const RoomSchema = ChannelSchema.extend({
  // type: z.enum(["chat", "stage"]),
});

export type Room = z.infer<typeof RoomSchema>;

export type Message = z.infer<typeof MessageSchema>;
