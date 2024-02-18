import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
  WriteTransaction,
} from "replicache";
import { replicacheWrapper } from "./replicache-wrapper";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: {
    id: string;
    username: string;
  };
};

export class User {
  private static user: User;
  // @ts-ignore
  store: Replicache<UserMutators>;

  private constructor() {}

  static async getInstance() {
    if (!User.user) {
      User.user = new User();
      await User.user.persistId();
      User.user.initStore();
    }
    return User.user;
  }

  async initStore() {
    this.store = new Replicache({
      name: this.id,
      licenseKey: "lc800451908284747976640672606f56d",
      pusher: replicacheWrapper<PushRequest, PusherResult>("push", this.id),
      puller: replicacheWrapper<PullRequest, PullerResult>("pull", this.id),
      mutators,
    });
  }

  // TODO: Handle edge case where userId exist but not the correct one
  /**
   * Persist userId in the local storage for accessing/creating the user data's replicache instance
   */
  async persistId() {
    if (this.id) return true;
    const { userId } = (await (
      await fetch("/api/auth/session")
    ).json()) as Session;

    if (!userId) throw new Error("No user id found");

    localStorage.setItem("userId", userId);

    return true;
  }

  get id() {
    return localStorage.getItem("userId")!;
  }
}

const mutators = {
  async createUser(tx: WriteTransaction, name: string) {
    await tx.set("name", name);
  },
};

export type UserMutators = typeof mutators;
