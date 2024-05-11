import { getUserById } from "@repo/data/server";
import { createClient } from "./server";

export async function currentUser() {
  const client = createClient();

  const userId = (await client.auth.getUser()).data.user?.id;

  return await getUserById(userId);
}
