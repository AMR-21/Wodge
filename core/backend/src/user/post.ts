import type * as Party from "partykit/server";
import { badRequest, getRoute, json, notChanged } from "../utils";
import { UserSchema } from "@repo/data/schemas";

export async function handlePost(req: Party.Request, room: Party.Room) {
  const route = getRoute(req);

  switch (route) {
    case "/populate":
      const userData = await req.json();

      const validatedFields = UserSchema.safeParse(userData);

      if (!validatedFields.success) return badRequest();

      const { data } = validatedFields;

      const usr = await room.storage.get("user:data");

      if (usr) return notChanged();

      await room.storage.put("user:data", data);

      return json({ message: "User data populated." }, 201);
    default:
      return badRequest();
  }
}
