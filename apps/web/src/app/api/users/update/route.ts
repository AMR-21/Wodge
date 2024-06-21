import { currentUser } from "@/lib/supabase/current-user";
import { sign } from "@/lib/utils/sign";
import { UpdateUserSchema } from "@repo/data";
import { updateUserById } from "@repo/data/server";
import { env } from "@repo/env";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 1. Authenticate access

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // 2. Validate data
  const validatedFields = UpdateUserSchema.safeParse(body);

  if (!validatedFields.success) {
    return new Response("Invalid data", { status: 400 });
  }

  const { data } = validatedFields;

  // 4. Update user data
  const { updatedUser, error } = await updateUserById(userId, {
    ...data,
    updatedAt: new Date(),
  });

  if (updatedUser) {
    const token = await sign({ userId });
    //inform workspaces
    await fetch(
      `${env.BACKEND_DOMAIN}/parties/user/${userId}/update?token=${token}`,
      {
        method: "POST",
      },
    );
    return Response.json({ success: true, user: updatedUser });
  }

  return Response.json({ error }, { status: 400 });
}
