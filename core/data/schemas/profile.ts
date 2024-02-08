import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ProfileSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .max(24, "Username must be between 3 and 24 characters.")
    .min(3, "Username must be between 3 and 24 characters.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, dashes, and underscores."
    ),
  displayName: z
    .string({
      required_error: "Display name is required",
    })
    .max(70, "Display name is too long")
    .min(1, "Display name is required"),
  avatar: z.string().url().optional().or(z.literal("/avatar.jpeg").optional()),
  avatarFile: z
    .custom<File>()
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .optional(),
});
