"use client";
export const runtime = "edge";

import { Button } from "@repo/ui";
import { signOut } from "next-auth/react";

function ProtectedPage() {
  return (
    <div>
      protected
      <Button onClick={() => signOut({})}>sign out</Button>
    </div>
  );
}

export default ProtectedPage;
