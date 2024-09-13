import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@repo/data/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Create a Supabase client
  const supabase = createClient();

  // Get the authenticated user
  const user = (await supabase.auth.getUser()).data.user;

  // If no user is authenticated, return 401 Unauthorized
  if (!user) {
    return new Response(null, { status: 401 });
  }

  // Fetch user data from the database
  const data = await getUserById(user.id);

  // If user data is not found, return 404 Not Found
  if (!data) {
    return new Response(null, { status: 401 });
  }

  // Return the user data as JSON
  return Response.json(data);
}
