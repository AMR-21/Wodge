import { currentUser } from "@/lib/utils";
import { UpdateUserSchema } from "@repo/data";
import { updateUserById } from "@repo/data/server";
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
  const res = await updateUserById(user.id, {
    ...data,
    updatedAt: new Date(),
  });

  if (res.user) return Response.json({ success: true, user: res.user });

  return Response.json({ error: res.error }, { status: 400 });
}
