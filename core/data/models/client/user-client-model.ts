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
  user: {
    id: string;
    username: string;
  };
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

  cacheUser({ id, email, avatar, displayName }: CacheUserType) {
    const userObj = { id, email, avatar, displayName };

    localStorage.setItem("user", JSON.stringify(userObj));
  }

  get data() {
    if (!localStorage.getItem("user")) throw Error("User data not found");
    return JSON.parse(localStorage.getItem("user")!);
  }
}

// const mutators = {
//   async createUser(tx: WriteTransaction, name: string) {
//     await tx.set("name", name);
//   },
// };

// export type UserMutators = typeof mutators;
