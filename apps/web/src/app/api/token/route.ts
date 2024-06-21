import { sign } from "@/lib/utils/sign";

export async function GET(req: Request) {
  // console.log(req.headers);
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const isUpload = req.headers.get("is-upload");

  const token = await sign(
    { userId, ...(isUpload && { isUpload: true }) },
    isUpload === "true" ? "1h" : "1m",
  );

  return new Response(JSON.stringify({ token }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
