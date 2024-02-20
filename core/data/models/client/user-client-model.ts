import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
  WriteTransaction,
} from "replicache";
import { replicacheWrapper } from "./replicache-wrapper";
import { CacheUserSchema, CacheUserType, UserType } from "../../schemas";
import { z } from "zod";
import * as React from "react";

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: CacheUserType;
};

export class User {
  private static user: User;
  // @ts-ignore
  // store: Replicache<UserMutators>;

  private constructor() {}

  static getInstance() {
    if (!User.user) {
      User.user = new User();
    }
    return User.user;
  }

  async initStore() {
    // this.store = new Replicache({
    //   name: this.id,
    //   licenseKey: "lc800451908284747976640672606f56d",
    //   pusher: replicacheWrapper<PushRequest, PusherResult>("push", this.id),
    //   puller: replicacheWrapper<PullRequest, PullerResult>("pull", this.id),
    //   mutators,
    // });
  }

  cacheUser({ id, email, avatar, displayName, username }: CacheUserType) {
    const userObj = { id, email, avatar, displayName, username };

    localStorage.setItem("user", JSON.stringify(userObj));
  }

  async getData(): Promise<CacheUserType> {
    if (!localStorage.getItem("user")) {
      const res = await fetch("/api/auth/session");
      const { user } = (await res.json()) as Session;
      this.cacheUser(user);
    }
    return JSON.parse(localStorage.getItem("user")!);
  }

  get data(): CacheUserType | null {
    if (!localStorage.getItem("user")) return null;
    return JSON.parse(localStorage.getItem("user")!);
  }
}
