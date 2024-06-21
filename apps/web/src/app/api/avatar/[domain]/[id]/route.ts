import { sign } from "@/lib/utils/sign";
import {
  getAvatarAddress,
  makeUserAvatarKey,
  makeWorkspaceAvatarKey,
} from "@repo/data";
import { updateUserById, updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";
import { split } from "lodash";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  { params: { domain, id } }: { params: { domain: string; id: string } },
) {
  const userId = req.headers.get("x-user-id");

  const key = req.headers.get("key");

  if (!userId || !key) {
    return new Response(null, { status: 400 });
  }

  if (domain === "workspace") {
    await updateWorkspaceById(id, {
      avatar: getAvatarAddress(makeWorkspaceAvatarKey(key)),
    });
  } else {
    await updateUserById(userId, {
      avatar: getAvatarAddress(makeUserAvatarKey(key)),
    });
  }

  return new Response(null, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params: { domain, id } }: { params: { domain: string; id: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 400 });
  }

  const token = await sign({ userId });
  if (domain === "workspace") {
    const workspace = await updateWorkspaceById(id, {
      avatar: null,
    });

    if (!workspace) {
      return new Response(null, { status: 400 });
    }

    return redirect(
      `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/avatar?token=${token}&key=${workspace.avatar?.split("/").pop()}`,
    );
  } else {
    const { user } = await updateUserById(userId, {
      avatar: null,
    });

    if (!user) {
      return new Response(null, { status: 400 });
    }

    return redirect(
      `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/avatar?token=${token}&key=${(user.avatar, split("/").pop())}`,
    );
  }
}
