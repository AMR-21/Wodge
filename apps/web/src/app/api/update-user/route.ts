import { currentUser } from "@/lib/supabase/current-user";
import { UpdateUserSchema } from "@repo/data";
import { updateUserById } from "@repo/data/server";
import { env } from "@repo/env";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 1. Authenticate access

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // 2. Validate data
  const validatedFields = UpdateUserSchema.safeParse(body);

  if (!validatedFields.success) {
    return new Response("Invalid data", { status: 400 });
  }

  const { data } = validatedFields;

  // TODO
  // 3. Check if there is a new profile avatar

  // 4. Update user data
  const { updatedUser, error } = await updateUserById(user.id, {
    ...data,
    updatedAt: new Date(),
  });

  if (updatedUser) {
    //inform workspaces
    await fetch(
      `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/user/${user.id}/update`,
      {
        method: "POST",
        headers: {
          authorization: env.SERVICE_KEY,
        },
      },
    );
    return Response.json({ success: true, user: updatedUser });
  }

  return Response.json({ error }, { status: 400 });
}
