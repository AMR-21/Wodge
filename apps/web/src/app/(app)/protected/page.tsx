"use client";
export const runtime = "edge";

import { Button } from "@repo/ui";
import { signOut, useSession } from "next-auth/react";

function ProtectedPage() {
  const session = useSession();

  return (
    <div>
      protected
      {JSON.stringify(session)}
      <Button onClick={() => signOut({})}>sign out</Button>
    </div>
  );
}

export default ProtectedPage;
