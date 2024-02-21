import { version } from "os";
import { z } from "zod";
import { ID_LENGTH } from "./config";

/**
 * General user schema
 * This identical to the one in the auth schema but with more evolved validation
 */
export const UserSchema = z.object({
  id: z.string().length(ID_LENGTH),
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

/**
 * User schema for updating user info
 * This is a subset of the UserSchema that only allows updating the avatar, username, and display name
 */
export const UpdateUserSchema = UserSchema.pick({
  avatar: true,
  username: true,
  displayName: true,
});

/**
 * Schema for the user object that is stored in the local storage
 */
export const LocalUserSchema = UserSchema.pick({
  id: true,
  avatar: true,
  username: true,
  displayName: true,
  email: true,
});

/**
 * Schema for user memberships stored in the durable object
 * {
 *  spaces: {
 *   "spaceId": ["role1", "role2"]
 * }
 * }
 */
export const UserWorkspacesStoreSchema = z.object({
  workspaces: z.array(z.string()),
  // Fields for replicache storage
  lastModifiedVersion: z.number(),
  deleted: z.boolean(),
});

export type UserType = z.infer<typeof UserSchema>;
export type LocalUserType = z.infer<typeof LocalUserSchema>;
export type UserWorkspacesStoreType = z.infer<typeof UserWorkspacesStoreSchema>;
