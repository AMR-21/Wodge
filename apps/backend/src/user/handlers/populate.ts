import { UserSchema, UserType } from "@repo/data/schemas";
import { Request, Room } from "partykit/server";
import { badRequest, json, notChanged } from "../../lib/http-utils";
import UserParty from "../user-party";
import { USER_PREFIX } from "@repo/data/prefixes";

// TODO Remove this function and use KV
/**
 * Function to populate the user party with user data
 */
export async function populate(req: Request, party: UserParty) {
  const userData = await req.json();

  const validatedFields = UserSchema.safeParse(userData);
  console.log(validatedFields);

  if (!validatedFields.success) return badRequest();

  const { data } = validatedFields;

  // const usr = await party.room.storage.get<UserType>(USER_PREFIX + data.id);
  const userExists = party.versions.has(USER_PREFIX + data.id);

  if (userExists) return notChanged();

  party.versions.set(USER_PREFIX + data.id, 1);
  party.versions.set("globalVersion", party.versions.get("globalVersion")! + 1);

  await party.room.storage.put({
    versions: party.versions,
    [USER_PREFIX + data.id]: data,
  });

  return json({ message: "User data populated." }, 201);
}
