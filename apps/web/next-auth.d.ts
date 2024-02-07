import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      hasProfile: boolean;
      // createdAt: string;
    } & DefaultSession["user"];
  }

  interface User {
    hasProfile: boolean;
  }
}

declare module "@auth/core" {
  interface AdapterUser {
    createdAt: Date;
  }
}
