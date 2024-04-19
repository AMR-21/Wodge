import { z } from "zod";
import { ID_LENGTH } from "./config";
import { ChannelSchema } from "./channel.schema";

export const ThreadSchema = ChannelSchema.extend({});

export const ThreadMessageSchema = z.object({
  id: z.string(),
  author: z.string().length(ID_LENGTH),
  content: z.string().min(1).max(4096),
  date: z.string().datetime(),
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;
export type Thread = z.infer<typeof ThreadSchema>;
