"use client";

import { Button } from "@repo/ui";
import { signOut, useSession } from "next-auth/react";

function ProfileSetupPage() {
  // const session = useSession();
  return (
    <div>
      <Button onClick={() => signOut({})}>sign out</Button>
    </div>
  );
}

export default ProfileSetupPage;
