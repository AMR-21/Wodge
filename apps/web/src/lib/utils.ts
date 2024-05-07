import { createClient } from "./supabase/server";
import { getUserById } from "@repo/data/server";

export type VerificationMail = {
  identifier?: string;
  url: string;
};

export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

export async function currentUser() {
  const client = createClient();

  const userId = (await client.auth.getUser()).data.user?.id;

  return await getUserById(userId);
}
