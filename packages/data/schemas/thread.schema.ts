import { z } from "zod";
import { ID_LENGTH } from "./config";
import { ChannelSchema } from "./channel.schema";

export const ThreadSchema = ChannelSchema.extend({
  createdBy: z.string().length(ID_LENGTH),
  isResolved: z.boolean().default(false),
});

export const ThreadMessageSchema = z.object({
  id: z.string(),
  author: z.string().length(ID_LENGTH),
  content: z.string().min(1).max(4096),
  date: z.string().datetime(),
  type: z.enum(["message", "open", "close"]),
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
