import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@repo/data/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await getUserById(user.id);

  if (!data) {
    return new Response(null, { status: 404 });
  }
  return Response.json(data);
}
