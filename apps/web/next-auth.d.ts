import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      username: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
  }
}
