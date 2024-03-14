"use client";

import { Button } from "@repo/ui/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutBtn() {
  return (
    <Button onClick={() => signOut()} className="w-full">
      Log out
    </Button>
  );
}
