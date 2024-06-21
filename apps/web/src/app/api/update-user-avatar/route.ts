import { sign } from "@/lib/utils/sign";
import {
  getAvatarAddress,
  makeUserAvatarKey,
  makeWorkspaceAvatarKey,
} from "@repo/data";
import { updateUserById, updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  const key = req.headers.get("key");

  if (!userId || !key) {
    return new Response(null, { status: 400 });
  }

  await updateUserById(userId, {
    avatar: getAvatarAddress(makeUserAvatarKey(key)),
  });

  return new Response(null, { status: 200 });
}

export async function DELETE(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 400 });
  }

  const { user } = await updateUserById(userId, {
    avatar: null,
  });

  const token = sign({ userId });

  return redirect(
    `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/user/${userId}/avatar?token=${token}`,
  );
}
