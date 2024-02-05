// "use client";

// import { useCurrentUser } from "@/hooks/useCurrentUser";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/utils";
import { profiles } from "@repo/data";
import { Button } from "@repo/ui";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";

async function ProfileSetupPage() {
  const user = await currentUser()!;
  // console.log(session?.user);
  if (!user) return redirect("/auth/login");

  console.log(user);
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id));

  // console.log(profile);

  return (
    <div>
      {/* <Button onClick={() => signOut({})}>sign out</Button> */}
      hello
    </div>
  );
}

export default ProfileSetupPage;
