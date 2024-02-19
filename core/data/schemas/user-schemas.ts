import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().length(21),
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
  avatar: z.optional(z.string().url()).or(z.literal("")),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.date(),
});

export const UpdateUserSchema = UserSchema.pick({
  avatar: true,
  username: true,
  displayName: true,
});

export const CacheUserSchema = UserSchema.pick({
  id: true,
  avatar: true,
  username: true,
  displayName: true,
  email: true,
});

export type UserType = z.infer<typeof UserSchema>;
export type CacheUserType = Pick<
  UserType,
  "id" | "username" | "email" | "avatar" | "displayName"
>;
