import { sign } from "@/lib/utils/sign";
import { env } from "@repo/env";
import { redirect } from "next/navigation";

export async function GET(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } },
) {
  const userId = req.headers.get("x-user-id");
  const username = req.headers.get("x-username");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const token = await sign({ userId, username });

  return redirect(
    `${env.BACKEND_DOMAIN}/parties/room/${channelId}/call-token?token=${token}`,
  );
}
