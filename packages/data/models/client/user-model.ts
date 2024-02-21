import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
  WriteTransaction,
} from "replicache";
import { replicacheWrapper } from "../utils";
import {
  LocalUserSchema,
  LocalUserType,
  NewWorkspaceSchema,
  NewWorkspaceType,
  UserSpaceStoreType,
} from "../../schemas";

export type SpaceStore = UserSpaceStoreType["spaces"];

export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: LocalUserType;
};

export class User {
  private static user: User;
  // @ts-ignore
  store: Replicache<UserMutators>;

  private constructor() {}

  static async getInstance() {
    if (!User.user) {
      User.user = new User();
      await User.user.getData();
      User.user.initStore();
    }
    return User.user;
  }

  initStore() {
    const id = this.data!.id;
    this.store = new Replicache({
      name: id,
      licenseKey: "lc800451908284747976640672606f56d",
      pusher: replicacheWrapper<PushRequest, PusherResult>("push", "user", id),
      puller: replicacheWrapper<PullRequest, PullerResult>("pull", "user", id),
      mutators,
    });
  }

  cacheUser({ id, email, avatar, displayName, username }: LocalUserType) {
    const userObj = { id, email, avatar, displayName, username };

    localStorage.setItem("user", JSON.stringify(userObj));
  }

  async getData(): Promise<LocalUserType> {
    if (!localStorage.getItem("user")) {
      const res = await fetch("/api/auth/session");
      const { user } = (await res.json()) as Session;
      this.cacheUser(user);
    }
    return JSON.parse(localStorage.getItem("user")!);
  }

  get data(): LocalUserType | null {
    if (!localStorage.getItem("user")) return null;
    const data = JSON.parse(localStorage.getItem("user")!);
    const validatedFields = LocalUserSchema.safeParse(data);

    if (!validatedFields.success)
      throw new Error("Invalid user data in local storage");

    return validatedFields.data;
  }
}

const mutators = {
  async createSpace(tx: WriteTransaction, data: NewWorkspaceType) {
    const validatedFields = NewWorkspaceSchema.safeParse(data);

    if (!validatedFields.success) throw new Error("Invalid data");

    const newSpace = validatedFields.data;

    const spaceStore = await tx.get<SpaceStore>("spaces");

    if (spaceStore) {
      // Space already exists
      try {
        spaceStore[newSpace.id];
      } catch (e) {
        return;
      }
    }

    const newSpaceStore = {
      ...spaceStore,
      [newSpace.id]: ["owner", "member"],
    };

    await tx.set("spaces", newSpaceStore);

    // TODO: create a new workspace instance
  },
};

type UserMutators = typeof mutators;
