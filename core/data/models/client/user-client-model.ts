import { Replicache } from "replicache";
import { UserType } from "../../schemas/auth.schema";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: {
    id: string;
    username: string;
  };
};

export type CSRF = {
  csrfToken: string;
};

export class User {
  private static user: User;

  private constructor() {}

  static getInstance(): User {
    if (!User.user) {
      User.user = new User();
    }

    return User.user;
  }

  static initialize(data: UserType) {}

  async session(): Promise<{ session: Session; csrf: CSRF }> {
    const curSession = localStorage.getItem("session");

    if (!curSession) {
      const session = (await (
        await fetch("/api/auth/session")
      ).json()) as Session;
      const csrf = (await (await fetch("/api/auth/csrf")).json()) as CSRF;

      if (!csrf || !session) throw new Error("No session or csrf token found");
      localStorage.setItem("session", JSON.stringify({ session, csrf }));
    }

    return JSON.parse(localStorage.getItem("session")!);
  }
}
