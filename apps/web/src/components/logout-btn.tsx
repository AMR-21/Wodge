"use client";

import { Button } from "../../../../packages/ui";
import { signOut } from "next-auth/react";

export function LogoutBtn() {
  return (
    <Button onClick={() => signOut()} className="w-full">
      Log out
    </Button>
  );
}
