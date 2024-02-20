import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      username: string;
      id: string;
      displayName: string;
      avatar: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    displayName: string;
    avatar: string;
  }
}
