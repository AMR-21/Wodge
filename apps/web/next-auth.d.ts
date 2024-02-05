// import type { AdapterUser, User } from "@auth/core/adapters";
// import "@auth/core/adapters";

// declare module "@auth/core/adapters" {
//   export interface AdapterUser {
//     avatar?: string | null;
//   }
// }

import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isComplete: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
